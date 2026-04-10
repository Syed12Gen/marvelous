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
  group: Group
  initialMessages: MessageWithSender[]
  currentUserId: string
  meterLevel: 'safe' | 'tension' | 'targeted' | 'bullying'
  meterSummary?: string | null
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const METER_BADGE: Record<string, string> = {
  safe:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  tension:  'bg-amber-50  text-amber-700  border-amber-200',
  targeted: 'bg-orange-50 text-orange-700 border-orange-200',
  bullying: 'bg-rose-50   text-rose-700   border-rose-200',
}

const METER_INSIGHT: Record<string, string> = {
  safe:     'bg-emerald-50 border-emerald-200 text-emerald-800',
  tension:  'bg-amber-50  border-amber-200  text-amber-800',
  targeted: 'bg-orange-50 border-orange-200 text-orange-800',
  bullying: 'bg-rose-50   border-rose-200   text-rose-800',
}

export default function ChatWindow({
  group,
  initialMessages,
  currentUserId,
  meterLevel,
  meterSummary,
}: Props) {
  const [messages, setMessages]         = useState<MessageWithSender[]>(initialMessages)
  const [input, setInput]               = useState('')
  const [sending, setSending]           = useState(false)
  const [sendError, setSendError]       = useState<string | null>(null)
  const [liveMeterLevel, setLiveMeterLevel]     = useState(meterLevel)
  const [liveMeterSummary, setLiveMeterSummary] = useState<string | null>(meterSummary ?? null)

  const bottomRef = useRef<HTMLDivElement>(null)
  const isFirst   = useRef(true)

  // Scroll to bottom when messages change; instant on first render
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: isFirst.current ? 'instant' : 'smooth',
    } as ScrollIntoViewOptions)
    isFirst.current = false
  }, [messages])

  // Real-time: new messages
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

          const { data } = await supabase
            .from('messages')
            .select('id, group_id, sender_id, content, is_flagged, created_at, users(name)')
            .eq('id', incoming.id)
            .single()

          if (!data) return
          const row = data as unknown as MessageRow

          setMessages((prev) => {
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

  // Real-time: meter / snapshot updates
  useEffect(() => {
    const channel = supabase
      .channel(`snapshots:${group.id}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'conversation_snapshots',
          filter: `group_id=eq.${group.id}`,
        },
        (payload) => {
          const row = payload.new as {
            meter_level:     'safe' | 'tension' | 'targeted' | 'bullying'
            pattern_summary: string | null
          }
          setLiveMeterLevel(row.meter_level)
          setLiveMeterSummary(row.pattern_summary)
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
      setMessages((prev) => prev.some((m) => m.id === json.id) ? prev : [...prev, json])
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Send failed.')
      setInput(trimmed)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">

      {/* ── App bar ── */}
      <header className="sticky top-0 z-10 shrink-0 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">

          {/* Left: back link */}
          <Link
            href="/home"
            className="shrink-0 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Home
          </Link>

          {/* Center: group name + type */}
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate font-semibold text-gray-900 leading-tight">{group.name}</p>
            <p className="text-xs text-gray-400 capitalize leading-tight">
              {group.group_type.replace('_', ' ')}
            </p>
          </div>

          {/* Right: meter badge */}
          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${METER_BADGE[liveMeterLevel]}`}
          >
            {liveMeterLevel}
          </span>
        </div>
      </header>

      {/* ── AI insight card (below header, same max-width) ── */}
      {liveMeterSummary && (
        <div className="shrink-0 px-4 pt-3 pb-1">
          <div className={`mx-auto max-w-3xl rounded-xl border px-4 py-2.5 text-xs ${METER_INSIGHT[liveMeterLevel]}`}>
            <span className="font-semibold">AI insight: </span>
            {liveMeterSummary}
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="mx-auto max-w-3xl space-y-3 px-4">
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
      </div>

      {/* ── Send error ── */}
      {sendError && (
        <p className="shrink-0 bg-red-50 px-4 py-1.5 text-center text-xs text-red-600">
          {sendError}
        </p>
      )}

      {/* ── Input bar ── */}
      <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3">
        <form
          onSubmit={handleSend}
          className="mx-auto flex max-w-3xl items-center gap-2"
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
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </form>
      </div>

    </div>
  )
}
