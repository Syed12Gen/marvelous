import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase-server'
import type { CreateGroupRequest, CreateGroupResponse } from '@/lib/types'

const VALID_GROUP_TYPES = ['classroom', 'workplace', 'friend_group', 'family'] as const

export async function POST(req: NextRequest) {
  // Log env availability up front
  console.log('[groups/create] SUPABASE_SERVICE_ROLE_KEY present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
  console.log('[groups/create] NEXT_PUBLIC_SUPABASE_URL present:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)

  // Authenticate
  let user
  try {
    const serverClient = await createSupabaseServerClient()
    const { data, error } = await serverClient.auth.getUser()
    console.log('[groups/create] auth.getUser error:', error)
    user = data.user
  } catch (err) {
    console.error('[groups/create] auth threw:', err)
    return NextResponse.json({ error: 'Auth error' }, { status: 500 })
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  console.log('[groups/create] authenticated user:', user.id)

  // Validate body
  let body: CreateGroupRequest
  try {
    body = await req.json() as CreateGroupRequest
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { name, group_type } = body

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Group name is required' }, { status: 400 })
  }
  if (!VALID_GROUP_TYPES.includes(group_type)) {
    return NextResponse.json({ error: 'Invalid group type' }, { status: 400 })
  }

  // Write with service client (bypasses RLS)
  const db = createSupabaseServiceClient()

  // Insert group
  let group: { id: string } | null = null
  try {
    const { data, error: groupError } = await db
      .from('groups')
      .insert({ name: name.trim(), group_type, created_by: user.id })
      .select('id')
      .single()

    console.log('[groups/create] groups insert error:', groupError?.message, groupError?.code, groupError?.details)
    if (groupError || !data) {
      return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
    }
    group = data as { id: string }
  } catch (err) {
    console.error('[groups/create] groups insert threw:', err)
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
  }

  console.log('[groups/create] group created:', group.id)

  // Insert creator as first member
  try {
    const payload = {
     group_id: group.id,
     user_id: user.id,
    }
    console.log('[groups/create] group_members payload:', payload)

    const { error: memberError } = await db
      .from('group_members')
      .insert(payload)

    console.log('[groups/create] group_members insert error:', memberError?.message, memberError?.code, memberError?.details)
    if (memberError) {
      return NextResponse.json({ error: 'Failed to add creator as member' }, { status: 500 })
    }
  } catch (err) {
    console.error('[groups/create] group_members insert threw:', err)
    return NextResponse.json({ error: 'Failed to add creator as member' }, { status: 500 })
  }

  console.log('[groups/create] success, groupId:', group.id)
  const response: CreateGroupResponse = { groupId: group.id }
  return NextResponse.json(response, { status: 201 })
}
