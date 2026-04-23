'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Group, MessageWithSender, SendMessageRequest } from '@/lib/types'
import GuidanceCardBanner from '@/components/GuidanceCardBanner'

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

const GROUP_EMOJI: Record<string, string> = {
  classroom:    '📚',
  workplace:    '💼',
  friend_group: '🌿',
  sports_team:  '⚽',
  family:       '🏡',
}

type MeterColors = { bg: string; border: string; text: string; dot: string }

const METER_BADGE: Record<string, MeterColors> = {
  safe:     { bg: '#E8F1E8', border: '#B9D8BA', text: '#2F6B36', dot: '#4CA159' },
  tension:  { bg: '#FFF3D9', border: '#FFD88A', text: '#8A5A0B', dot: '#F4A13B' },
  targeted: { bg: '#FFE4D6', border: '#FFB993', text: '#A8431E', dot: '#EF6B3E' },
  bullying: { bg: '#FDDCDE', border: '#F4A4AB', text: '#9E2838', dot: '#E5374A' },
}

type InsightColors = { bg: string; border: string; color: string }

const METER_INSIGHT: Record<string, InsightColors> = {
  safe:     { bg: '#E8F1E8', border: '#B9D8BA', color: '#2F6B36' },
  tension:  { bg: '#FFF3D9', border: '#FFD88A', color: '#8A5A0B' },
  targeted: { bg: '#FFE4D6', border: '#FFB993', color: '#A8431E' },
  bullying: { bg: '#FDDCDE', border: '#F4A4AB', color: '#9E2838' },
}

const AVATAR_PALETTE = [
  '#534AB7', '#7A71D4', '#E05E8E', '#EF6B3E', '#F4A13B',
  '#4CA159', '#2F6B36', '#1C8CB5', '#9990D4', '#A8431E',
]

function avatarColor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash * 31) + id.charCodeAt(i)) | 0
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length]
}

export default function ChatWindow({
  group,
  initialMessages,
  currentUserId,
  meterLevel,
  meterSummary,
}: Props) {
  const [messages, setMessages]                     = useState<MessageWithSender[]>(initialMessages)
  const [input, setInput]                           = useState('')
  const [sending, setSending]                       = useState(false)
  const [sendError, setSendError]                   = useState<string | null>(null)
  const [liveMeterLevel, setLiveMeterLevel]         = useState(meterLevel)
  const [liveMeterSummary, setLiveMeterSummary]     = useState<string | null>(meterSummary ?? null)
  const [newMessageIds, setNewMessageIds]           = useState<Set<string>>(new Set())
  const [sendBtnPressed, setSendBtnPressed]         = useState(false)

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
          setNewMessageIds((ids) => new Set([...ids, row.id]))
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
      setNewMessageIds((ids) => new Set([...ids, json.id]))
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Send failed.')
      setInput(trimmed)
    } finally {
      setSending(false)
    }
  }

  const badge   = METER_BADGE[liveMeterLevel]   ?? METER_BADGE.safe
  const insight = METER_INSIGHT[liveMeterLevel] ?? METER_INSIGHT.safe
  const emoji   = GROUP_EMOJI[group.group_type] ?? '💬'
  const hasInput = input.trim().length > 0

  return (
    <div className="flex h-screen flex-col" style={{ background: '#F5F3FC' }}>

      {/* ── App bar ── */}
      <header
        className="sticky top-0 z-10 shrink-0"
        style={{ background: 'linear-gradient(180deg, #534AB7, #36307A)' }}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">

          {/* Back arrow */}
          <Link
            href="/home"
            className="shrink-0 transition-opacity hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.85)', fontSize: 20, lineHeight: 1, fontWeight: 300 }}
            aria-label="Back to home"
          >
            ←
          </Link>

          {/* Group emoji icon */}
          <div
            className="shrink-0 flex items-center justify-center rounded-xl text-lg"
            style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.18)' }}
          >
            {emoji}
          </div>

          {/* Group name + type */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-white leading-tight" style={{ fontSize: 15 }}>
              {group.name}
            </p>
            <p className="capitalize leading-tight" style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
              {group.group_type.replace('_', ' ')}
            </p>
          </div>

          {/* Meter badge */}
          <div
            className="shrink-0 flex items-center gap-1.5 rounded-full border px-2.5 py-1"
            style={{ background: badge.bg, borderColor: badge.border, color: badge.text }}
          >
            <span
              className="rounded-full shrink-0"
              style={{ width: 7, height: 7, background: badge.dot, display: 'inline-block' }}
            />
            <span className="text-xs font-semibold capitalize">{liveMeterLevel}</span>
          </div>
        </div>
      </header>

      {/* ── AI insight strip ── */}
      {liveMeterSummary && (
        <div className="shrink-0 px-4 pt-3 pb-1">
          <div
            className="mx-auto max-w-3xl border"
            style={{
              background:   insight.bg,
              borderColor:  insight.border,
              color:        insight.color,
              borderRadius: 16,
              padding:      '10px 14px',
              fontSize:     13,
            }}
          >
            <span className="font-bold">AI insight: </span>
            {liveMeterSummary}
          </div>
        </div>
      )}

      {/* ── Guidance card banner ── */}
      <GuidanceCardBanner groupId={group.id} currentUserId={currentUserId} />

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="mx-auto max-w-3xl space-y-3 px-4">

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="mt-16 flex flex-col items-center gap-3">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
                {/* Outer dashed ring */}
                <circle
                  cx="60" cy="60" r="56"
                  stroke="#BFB9E4"
                  strokeWidth="1"
                  strokeDasharray="2 6"
                  fill="none"
                />
                {/* Middle fill */}
                <circle cx="60" cy="60" r="38" fill="#EBE9F7" />
                {/* Inner pulse dot */}
                <circle
                  cx="60" cy="60" r="14"
                  fill="#534AB7"
                  fillOpacity="0.9"
                  className="animate-pulse-dot"
                />
              </svg>
              <p className="text-base font-semibold" style={{ color: '#1C1B2E' }}>
                A quiet space.
              </p>
              <p style={{ fontSize: 13, color: '#6B6880' }}>
                Say hello to start the conversation.
              </p>
            </div>
          )}

          {/* Message list */}
          {messages.map((msg, i) => {
            const isOwn        = msg.sender_id === currentUserId
            const prevMsg      = i > 0 ? messages[i - 1] : null
            const showName     = !isOwn && msg.sender_id !== prevMsg?.sender_id
            const isNew        = newMessageIds.has(msg.id)
            const initial      = msg.sender_name.charAt(0).toUpperCase()
            const color        = avatarColor(msg.sender_id)

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} ${isNew ? (isOwn ? 'msg-enter-own' : 'msg-enter-other') : ''}`}
              >
                {/* Sender name (only on first bubble in a run) */}
                {showName && (
                  <span
                    className="mb-1 font-semibold"
                    style={{ fontSize: 12, color: '#6B6880', paddingLeft: 38 }}
                  >
                    {msg.sender_name}
                  </span>
                )}

                <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar (others only) */}
                  {!isOwn && (
                    <div
                      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
                      style={{ width: 30, height: 30, background: color, fontSize: 12 }}
                    >
                      {initial}
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className="max-w-[75%] px-4 py-2 text-sm"
                    style={
                      isOwn
                        ? {
                            background:   '#534AB7',
                            color:        '#ffffff',
                            borderRadius: '20px 20px 6px 20px',
                            boxShadow:    '0 2px 6px -1px rgba(83,74,183,0.28)',
                          }
                        : {
                            background:   '#ffffff',
                            color:        '#1C1B2E',
                            borderRadius: '20px 20px 20px 6px',
                            boxShadow:    'inset 0 0 0 1px #E4E1F0',
                          }
                    }
                  >
                    {msg.content}
                  </div>
                </div>

                {/* Timestamp */}
                <span
                  className="mt-0.5 text-xs"
                  style={{ color: '#9996AD', paddingLeft: isOwn ? 0 : 38 }}
                >
                  {formatTime(msg.created_at)}
                </span>
              </div>
            )
          })}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Send error ── */}
      {sendError && (
        <p className="shrink-0 px-4 py-1.5 text-center text-xs text-red-600" style={{ background: '#FEF2F2' }}>
          {sendError}
        </p>
      )}

      {/* ── Composer ── */}
      <div
        className="shrink-0 px-4 py-3"
        style={{ background: '#ffffff', borderTop: '1px solid #E4E1F0' }}
      >
        <form
          onSubmit={handleSend}
          className="mx-auto flex max-w-3xl items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message..."
            disabled={sending}
            className="flex-1 text-sm disabled:opacity-50 focus:outline-none"
            style={{
              borderRadius:    9999,
              background:      '#FAF9FD',
              border:          '1.5px solid #E4E1F0',
              padding:         '10px 18px',
              color:           '#1C1B2E',
              transition:      'border-color 150ms, box-shadow 150ms',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#534AB7'
              e.currentTarget.style.boxShadow   = '0 0 0 3px #EBE9F7'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E4E1F0'
              e.currentTarget.style.boxShadow   = 'none'
            }}
          />

          <button
            type="submit"
            disabled={sending || !hasInput}
            className="shrink-0 flex items-center justify-center transition-all"
            style={{
              width:        44,
              height:       44,
              borderRadius: '50%',
              background:   hasInput ? '#534AB7' : '#E4E1F0',
              boxShadow:    hasInput ? '0 4px 12px -2px rgba(83,74,183,0.38)' : 'none',
              transform:    sendBtnPressed ? 'scale(0.88) rotate(-14deg)' : 'scale(1) rotate(0deg)',
              transition:   'transform 200ms var(--ease-spring), background 150ms, box-shadow 150ms',
              cursor:       hasInput ? 'pointer' : 'not-allowed',
            }}
            onMouseDown={() => { if (hasInput) setSendBtnPressed(true) }}
            onMouseUp={() => setSendBtnPressed(false)}
            onMouseLeave={() => setSendBtnPressed(false)}
            aria-label="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M3 9H15M15 9L10 4M15 9L10 14"
                stroke={hasInput ? '#ffffff' : '#9996AD'}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>

    </div>
  )
}
