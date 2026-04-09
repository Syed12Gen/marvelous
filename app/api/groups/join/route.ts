import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase-server'
import type { JoinGroupRequest, JoinGroupResponse } from '@/lib/types'

const VALID_TAGS = ['Student', 'Coworker', 'Friend', 'Family'] as const

export async function POST(req: NextRequest) {
  // Authenticate
  const serverClient = await createSupabaseServerClient()
  const { data: { user } } = await serverClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Validate body
  let body: JoinGroupRequest
  try {
    body = await req.json() as JoinGroupRequest
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { groupId, relationshipTag } = body

  if (!groupId || typeof groupId !== 'string' || groupId.trim().length === 0) {
    return NextResponse.json({ error: 'Group ID is required' }, { status: 400 })
  }
  if (!VALID_TAGS.includes(relationshipTag)) {
    return NextResponse.json({ error: 'Invalid relationship tag' }, { status: 400 })
  }

  const db = createSupabaseServiceClient()

  // Check the group exists
  const { data: group, error: groupError } = await db
    .from('groups')
    .select('id')
    .eq('id', groupId.trim())
    .single()

  if (groupError || !group) {
    return NextResponse.json({ error: 'Group not found' }, { status: 404 })
  }

  // Check not already a member
  const { data: existing } = await db
    .from('group_members')
    .select('id')
    .eq('group_id', groupId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Already a member of this group' }, { status: 409 })
  }

  // Add member
  const { error: memberError } = await db
    .from('group_members')
    .insert({
      id:           crypto.randomUUID(),
      group_id:     groupId,
      user_id:      user.id,
      current_role: 'neutral',
      is_defender:  false,
      joined_at:    new Date().toISOString(),
    })

  if (memberError) {
    console.error('[groups/join] group_members insert failed:', memberError)
    return NextResponse.json({ error: 'Failed to join group' }, { status: 500 })
  }

  // Store relationship tag on the user's profile
  await db
    .from('users')
    .update({ relationship_tag: relationshipTag })
    .eq('id', user.id)

  const response: JoinGroupResponse = { groupId }
  return NextResponse.json(response, { status: 200 })
}
