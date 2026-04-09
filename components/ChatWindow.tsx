'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Group, MessageWithSender, SendMessageRequest } from '@/lib/types'

// Shape returned by the Supabase nested select in the real-time handler
type MessageRow = {
  id:         string
  group_id:   string
  sender_id:  string
  content:    string
  is_flagged: boolean
  created_at: string
  users:      { name: string } | null
}

interface Props {
  group:           Group
  initialMessages: MessageWithSender[]
  currentUserId:   string
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatWindow({ group, initialMessages, currentUserId }: Props) {
  const [messages, setMessages] = useState<MessageWithSender[]>(initialMessages)
  const [input, setInput]       = useState('')
  const [sending, setSending]   = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)
  const isFirst   = useRef(true)

  // Scroll to bottom when messages change; instant on first render
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: isFirst.current ? 'instant' : 'smooth',
    } as ScrollIntoViewOptions)
    isFirst.current = false
  }, [messages])

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${group.id}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'messages',
          filter: `group_id=eq.${group.id}`,
        },
        async (payload) => {
          const incoming = payload.new as { id: string }

          // Fetch the full row with sender name
          const { data } = await supabase
            .from('messages')
            .select('id, group_id, sender_id, content, is_flagged, created_at, users(name)')
            .eq('id', incoming.id)
            .single()

          if (!data) return
          const row = data as unknown as MessageRow

          setMessages((prev) => {
            // Dedup — own messages are already added via the API response
            if (prev.some((m) => m.id === row.id)) return prev
            return [
              ...prev,
              {
                id:          row.id,
                group_id:    row.group_id,
                sender_id:   row.sender_id,
                content:     row.content,
                is_flagged:  row.is_flagged,
                created_at:  row.created_at,
                sender_name: row.users?.name ?? 'Unknown',
              },
            ]
          })
        },
      )
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  }, [group.id])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || sending) return
    setSendError(null)
    setSending(true)
    setInput('')
    try {
      const body: SendMessageRequest = { group_id: group.id, content: trimmed }
      const res = await fetch('/api/messages', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      const json = await res.json() as MessageWithSender & { error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Failed to send')
      // Add immediately; real-time event will be deduped by ID
      setMessages((prev) => prev.some((m) => m.id === json.id) ? prev : [...prev, json])
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Send failed.')
      setInput(trimmed) // restore on error
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shrink-0">
        <Link href="/home" className="text-sm text-gray-500 hover:text-gray-900">
          ← Home
        </Link>
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900">{group.name}</p>
          <p className="text-xs text-gray-500 capitalize">
            {group.group_type.replace('_', ' ')}
          </p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="mt-8 text-center text-sm text-gray-400">
            No messages yet. Say hello!
          </p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
            >
              {!isOwn && (
                <span className="mb-0.5 text-xs font-medium text-gray-500">
                  {msg.sender_name}
                </span>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  isOwn
                    ? 'rounded-br-sm bg-indigo-600 text-white'
                    : 'rounded-bl-sm bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                }`}
              >
                {msg.content}
              </div>
              <span className="mt-0.5 text-xs text-gray-400">{formatTime(msg.created_at)}</span>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Send error */}
      {sendError && (
        <p className="shrink-0 bg-red-50 px-4 py-1.5 text-xs text-red-600">{sendError}</p>
      )}

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex shrink-0 items-center gap-2 border-t border-gray-200 bg-white px-4 py-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message…"
          disabled={sending}
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={sending || input.trim().length === 0}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
