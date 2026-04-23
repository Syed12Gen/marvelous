'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type GuidanceCard = {
  id:        string
  card_type: string
  content:   string
  shown_at:  string
}

// Shape of the raw realtime INSERT payload for guidance_cards
type GuidanceCardRow = GuidanceCard & { user_id: string }

interface Props {
  groupId:       string
  currentUserId: string
}

const CARD_STYLE: Record<string, { bg: string; border: string; labelColor: string }> = {
  victim:    { bg: '#EBE9F7', border: '#BFB9E4', labelColor: '#453DA0' },
  bully:     { bg: '#FFF3D9', border: '#FFD88A', labelColor: '#8A5A0B' },
  bystander: { bg: '#E8F1E8', border: '#B9D8BA', labelColor: '#2F6B36' },
}

const FALLBACK_STYLE = CARD_STYLE['bystander']

export default function GuidanceCardBanner({ groupId, currentUserId }: Props) {
  const [card, setCard] = useState<GuidanceCard | null>(null)

  useEffect(() => {
    // Fetch the latest undismissed guidance card for this user in this group
    void supabase
      .from('guidance_cards')
      .select('id, card_type, content, shown_at')
      .eq('group_id', groupId)
      .eq('user_id', currentUserId)
      .is('dismissed_at', null)
      .order('shown_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setCard(data as GuidanceCard)
      })

    // Realtime: show new cards as they are inserted
    const channel = supabase
      .channel(`guidance_cards:${groupId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'guidance_cards',
          filter: `group_id=eq.${groupId}`,
        },
        (payload) => {
          const row = payload.new as GuidanceCardRow
          // Only surface the card if it belongs to the current user
          if (row.user_id === currentUserId) {
            setCard({
              id:        row.id,
              card_type: row.card_type,
              content:   row.content,
              shown_at:  row.shown_at,
            })
          }
        },
      )
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  }, [groupId, currentUserId])

  async function handleDismiss() {
    if (!card) return
    await supabase
      .from('guidance_cards')
      .update({ dismissed_at: new Date().toISOString(), was_opened: true })
      .eq('id', card.id)
    setCard(null)
  }

  if (!card) return null

  const style = CARD_STYLE[card.card_type] ?? FALLBACK_STYLE

  return (
    <div className="shrink-0 px-4 pt-2 pb-1">
      <div
        className="mx-auto max-w-3xl border px-4 py-3"
        style={{
          background:   style.bg,
          borderColor:  style.border,
          borderRadius: 20,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className="uppercase font-bold tracking-wide"
              style={{ fontSize: 12, color: style.labelColor }}
            >
              A moment to reflect
            </p>
            <p className="mt-1 text-sm" style={{ color: '#3F3D5C' }}>
              {card.content}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="shrink-0 transition-opacity hover:opacity-60"
            style={{ color: style.labelColor, fontSize: 15, lineHeight: 1 }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
