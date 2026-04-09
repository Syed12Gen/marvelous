import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import ChatWindow from '@/components/ChatWindow'
import type { Group, MessageWithSender } from '@/lib/types'

type MessageRow = {
  id:         string
  group_id:   string
  sender_id:  string
  content:    string
  is_flagged: boolean
  created_at: string
  users:      { name: string } | null
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Verify membership
  const { data: membership } = await supabase
    .from('group_members')
    .select('id')
    .eq('group_id', id)
    .eq('user_id', user.id)
    .single()

  if (!membership) redirect('/home')

  // Fetch group details
  const { data: group } = await supabase
    .from('groups')
    .select('id, name, group_type, created_by, no_exit_mode, created_at')
    .eq('id', id)
    .single<Group>()

  if (!group) redirect('/home')

  // Fetch last 50 messages with sender name
  const { data: rawMessages } = await supabase
    .from('messages')
    .select('id, group_id, sender_id, content, is_flagged, created_at, users(name)')
    .eq('group_id', id)
    .order('created_at', { ascending: true })
    .limit(50)

  const initialMessages: MessageWithSender[] = (rawMessages ?? []).map((row) => {
    const r = row as unknown as MessageRow
    return {
      id:          r.id,
      group_id:    r.group_id,
      sender_id:   r.sender_id,
      content:     r.content,
      is_flagged:  r.is_flagged,
      created_at:  r.created_at,
      sender_name: r.users?.name ?? 'Unknown',
    }
  })

  return (
    <ChatWindow
      group={group}
      initialMessages={initialMessages}
      currentUserId={user.id}
    />
  )
}
