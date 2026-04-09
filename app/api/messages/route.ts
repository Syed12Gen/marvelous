import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase-server'
import type { SendMessageRequest, MessageWithSender } from '@/lib/types'
import { analyzeMessages } from '@/lib/claude'

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
        console.log('Claude analysis result:', aiResponse)
      } catch (err) {
        console.error('[messages] Claude call failed:', err)
      }
    }
  }

  return NextResponse.json(message, { status: 201 })
}