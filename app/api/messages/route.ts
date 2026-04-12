import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase-server'
import type { SendMessageRequest, MessageWithSender } from '@/lib/types'
import { analyzeMessages, bullyEmpathyMirror } from '@/lib/claude'

// The shape Supabase returns when we join messages with the users table.
// We use this locally to safely read the nested `users.name` field.
type MessageRow = {
  id:         string
  group_id:   string
  sender_id:  string
  content:    string
  is_flagged: boolean
  created_at: string
  users:      { name: string } | null
}

const MAX_CONTENT_LENGTH = 1000

// POST /api/messages
// Accepts { group_id, content }, saves the message, and returns it with the sender's name.
export async function POST(req: NextRequest) {

  // 1. Check the user is logged in.
  //    createSupabaseServerClient reads the session cookie set at login.
  const serverClient = await createSupabaseServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse and validate the request body.
  let body: SendMessageRequest
  try {
    body = await req.json() as SendMessageRequest
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { group_id, content } = body

  if (!group_id || typeof group_id !== 'string' || group_id.trim().length === 0) {
    return NextResponse.json({ error: 'group_id is required' }, { status: 400 })
  }
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 })
  }
  if (content.trim().length > MAX_CONTENT_LENGTH) {
    return NextResponse.json(
      { error: `Message cannot exceed ${MAX_CONTENT_LENGTH} characters` },
      { status: 400 },
    )
  }

  // 3. Use the service role client for all database writes.
  //    This bypasses Row Level Security so the server can always read/write freely.
  const db = createSupabaseServiceClient()

  // 4. Check the user is actually a member of the group they're posting to.
  //    We distinguish two failure cases:
  //      - PGRST116 means the query ran fine but found no matching row → not a member
  //      - Any other error means something went wrong with the database itself
  const { data: membership, error: membershipError } = await db
    .from('group_members')
    .select('id')
    .eq('group_id', group_id)
    .eq('user_id', user.id)
    .single()

  if (membershipError) {
    if (membershipError.code === 'PGRST116') {
      return NextResponse.json({ error: 'Not a member of this group' }, { status: 403 })
    }
    console.error('[messages] membership check failed:', membershipError)
    return NextResponse.json({ error: 'Failed to verify group membership' }, { status: 500 })
  }

  if (!membership) {
    return NextResponse.json({ error: 'Not a member of this group' }, { status: 403 })
  }

  // 5. Insert the message and immediately fetch it back joined with the sender's name.
  //    Doing this in one call (insert + select) avoids a separate round-trip.
  const trimmedContent = content.trim()
  const { data: raw, error: insertError } = await db
    .from('messages')
    .insert({ group_id, content: trimmedContent, sender_id: user.id })
    .select('id, group_id, sender_id, content, is_flagged, created_at, users(name)')
    .single()

  if (insertError || !raw) {
    console.error('[messages] insert failed:', insertError)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }

  // 6. Flatten the nested users object into the MessageWithSender shape the client expects.
  const row = raw as unknown as MessageRow
  const message: MessageWithSender = {
    id:          row.id,
    group_id:    row.group_id,
    sender_id:   row.sender_id,
    content:     row.content,
    is_flagged:  row.is_flagged,
    created_at:  row.created_at,
    sender_name: row.users?.name ?? 'Unknown',
  }

    // 7. Check whether it's time to run AI analysis on this group's conversation.
  //    The app analyses messages in batches of 5 rather than one at a time — this is
  //    cheaper (fewer API calls) and gives the AI enough context to detect patterns.
  const { count, error: countError } = await db
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('group_id', group_id)

  if (countError) {
    // A failed count is not worth blocking the response — log and move on.
    console.error('[messages] count query failed:', countError)
  } else if (count !== null && count % 5 === 0) {
    console.log(`Trigger AI analysis for group: ${group_id}`)

    const { data: recentMessages, error: fetchError } = await db
      .from('messages')
      .select('content')
      .eq('group_id', group_id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (fetchError || !recentMessages) {
      console.error('[messages] failed to fetch recent messages:', fetchError)
    } else {
      const orderedMessages = recentMessages.reverse().map((m) => m.content)

      try {
        const aiResponse = await analyzeMessages(orderedMessages)
        const text = (aiResponse as any)?.content?.[0]?.text ?? ''

        const cleaned = text
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .trim()

        try {
          const parsed = JSON.parse(cleaned)
          console.log('Claude parsed JSON:', parsed)

          const meterLevel = parsed.tone === 'tense' ? 'tension' : parsed.tone
          console.log('Meter level:', meterLevel)

          // Save snapshot into conversation_snapshots, capturing the new row's id
          const { data: snapshotData, error: snapshotError } = await db
            .from('conversation_snapshots')
            .insert({
              group_id,
              meter_level: meterLevel,
              targeted_user_id: null,
              pattern_summary: parsed.summary,
              people_involved: [],
            })
            .select('id')
            .single()

          if (snapshotError) {
            console.error('[messages] Failed to insert conversation snapshot:', snapshotError)
          } else {
            console.log('[messages] Snapshot saved')

            // ── Guidance cards ────────────────────────────────────────────
            try {
              if (meterLevel === 'targeted' || meterLevel === 'bullying') {
                const snapshotId = (snapshotData as { id: string }).id

                // 3. Fetch group type (needed for victim card copy + empathy mirror)
                const { data: groupData } = await db
                  .from('groups')
                  .select('group_type')
                  .eq('id', group_id)
                  .single()
                const groupType =
                  (groupData as { group_type: string } | null)?.group_type ?? 'friend_group'

                // 4. Fetch group members with names
                type MemberRow = { user_id: string; users: { name: string } | null }
                const { data: membersRaw, error: membersError } = await db
                  .from('group_members')
                  .select('user_id, users(name)')
                  .eq('group_id', group_id)

                if (membersError || !membersRaw || membersRaw.length === 0) {
                  console.error('[guidance] error fetching members', membersError)
                } else {
                  const members = membersRaw as unknown as MemberRow[]

                  // 5. Determine victimUserId by name-matching Claude's output
                  const likelyTargeted =
                    typeof parsed.likely_targeted_user === 'string'
                      ? parsed.likely_targeted_user.trim().toLowerCase()
                      : null
                  let victimUserId: string | null = null
                  if (likelyTargeted) {
                    const match = members.find(
                      (m) => (m.users?.name ?? '').trim().toLowerCase() === likelyTargeted,
                    )
                    victimUserId = match?.user_id ?? null
                  }

                  // 6. Bully = sender of the message just inserted
                  const bullyUserId = user.id

                  // 7. Bystanders = everyone else
                  const excluded = new Set(
                    [victimUserId, bullyUserId].filter((id): id is string => id !== null),
                  )
                  const bystanderIds = members
                    .map((m) => m.user_id)
                    .filter((id) => !excluded.has(id))

                  // 8. Card content
                  const groupTypeSuffix: Record<string, string> = {
                    classroom:    'You have the right to feel safe at school.',
                    workplace:    'You have the right to a safe work environment.',
                    friend_group: "Real friends don't treat each other this way.",
                    family:       'You deserve to feel safe even at home.',
                  }
                  const victimContent =
                    `We see what's happening here. What's being done to you is not okay. ` +
                    `You didn't cause this and you don't deserve it. ` +
                    (groupTypeSuffix[groupType] ?? 'You deserve to feel safe.')

                  const victimName = victimUserId
                    ? (members.find((m) => m.user_id === victimUserId)?.users?.name ?? null)
                    : null
                  const bystanderContent = victimName
                    ? `Someone in this group — ${victimName} — may be feeling targeted. Even sending them a quick private message saying 'hey, you okay?' would make a real difference.`
                    : `Someone in this group may be feeling targeted. Even sending them a quick private message saying 'hey, you okay?' would make a real difference.`

                  const bullyContent =
                    meterLevel === 'bullying'
                      ? await bullyEmpathyMirror({ message: trimmedContent, groupType })
                      : 'Your recent message may have landed harder than you intended. Consider how it felt to receive it.'

                  // Build the full list of cards to attempt
                  type CardSpec = { user_id: string; card_type: string; content: string }
                  const cards: CardSpec[] = []
                  if (victimUserId) {
                    cards.push({ user_id: victimUserId, card_type: 'victim',    content: victimContent })
                  }
                  cards.push(   { user_id: bullyUserId,  card_type: 'bully',     content: bullyContent })
                  for (const id of bystanderIds) {
                    cards.push( { user_id: id,            card_type: 'bystander', content: bystanderContent })
                  }

                  // 9 + 10. Anti-spam check then insert
                  let insertedCount = 0
                  for (const card of cards) {
                    // Skip if an undismissed card already exists for this user in this group
                    const { data: existing } = await db
                      .from('guidance_cards')
                      .select('id')
                      .eq('user_id', card.user_id)
                      .eq('group_id', group_id)
                      .is('dismissed_at', null)
                      .limit(1)
                      .maybeSingle()

                    if (existing) continue

                    const { error: cardInsertError } = await db
                      .from('guidance_cards')
                      .insert({
                        user_id:     card.user_id,
                        group_id,
                        snapshot_id: snapshotId,
                        card_type:   card.card_type,
                        content:     card.content,
                        shown_at:    new Date().toISOString(),
                      })

                    if (cardInsertError) {
                      console.error('[guidance] error inserting card:', cardInsertError)
                    } else {
                      insertedCount++
                    }
                  }

                  // 11. Summary log
                  console.log(`[guidance] created ${insertedCount} cards for snapshot ${snapshotId}`)
                }
              }
            } catch (guidanceErr) {
              console.error('[guidance] error:', guidanceErr)
            }
            // ── End guidance cards ────────────────────────────────────────
          }
        } catch (e) {
          console.error('[messages] Failed to parse Claude JSON:', cleaned)
        }
      } catch (err) {
        console.error('[messages] Claude call failed:', err)
      }
    }
  }

  return NextResponse.json(message, { status: 201 })
}