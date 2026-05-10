'use client'

import { useEffect, useState } from 'react'

type MeterLevel = 'safe' | 'tension' | 'bullying'

interface ChatMsg {
  id:          number
  author:      string
  text:        string
  isOwn?:      boolean
  avatarColor: string
  initials:    string
}

const MESSAGES: ChatMsg[] = [
  { id: 1, author: 'Zain',  initials: 'Z', avatarColor: '#534AB7', text: 'hey guys did anyone finish the homework?' },
  { id: 2, author: 'Sara',  initials: 'S', avatarColor: '#4CA159', text: 'yeah i did, it was pretty easy' },
  { id: 3, author: 'You',   initials: 'Y', avatarColor: '#534AB7', text: 'same, took me like 20 mins', isOwn: true },
  { id: 4, author: 'Sara',  initials: 'S', avatarColor: '#4CA159', text: 'zain you always take forever lol' },
  { id: 5, author: 'Sara',  initials: 'S', avatarColor: '#4CA159', text: 'nobody wants to wait for you' },
  { id: 6, author: 'Hamza', initials: 'H', avatarColor: '#D94458', text: 'yeah stop slowing everyone down zain' },
  { id: 7, author: 'Hamza', initials: 'H', avatarColor: '#D94458', text: 'you should just leave the group' },
]

const METER: Record<MeterLevel, { bg: string; border: string; text: string; dot: string; label: string; insightBg: string; insightBorder: string; insightText: string }> = {
  safe:     { bg: '#E8F1E8', border: '#B9D8BA', text: '#2F6B36', dot: '#4CA159',  label: 'Safe',     insightBg: '#E8F1E8', insightBorder: '#B9D8BA', insightText: '#2F6B36' },
  tension:  { bg: '#FFF3D9', border: '#FFD88A', text: '#8A5A0B', dot: '#F4A13B',  label: 'Tension',  insightBg: '#FFF3D9', insightBorder: '#FFD88A', insightText: '#8A5A0B' },
  bullying: { bg: '#FDDCDE', border: '#F4A4AB', text: '#9E2838', dot: '#D94458',  label: 'Bullying', insightBg: '#FDDCDE', insightBorder: '#F4A4AB', insightText: '#9E2838' },
}

export default function ChatPreview() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [meterLevel,   setMeterLevel]   = useState<MeterLevel>('safe')
  const [showInsight,  setShowInsight]   = useState(false)
  const [insightText,  setInsightText]   = useState('')
  const [showGuidance, setShowGuidance]  = useState(false)

  useEffect(() => {
    let cancelled = false

    function run() {
      if (cancelled) return
      setVisibleCount(0)
      setMeterLevel('safe')
      setShowInsight(false)
      setInsightText('')
      setShowGuidance(false)

      for (let i = 1; i <= 7; i++) {
        setTimeout(() => {
          if (cancelled) return
          setVisibleCount(i)
          if (i === 5) {
            setMeterLevel('tension')
            setShowInsight(true)
            setInsightText('Tone is turning sharp — one person is being singled out.')
          }
          if (i === 7) {
            setMeterLevel('bullying')
            setInsightText('Multiple users targeting one person — this is bullying.')
            setTimeout(() => { if (!cancelled) setShowGuidance(true) }, 300)
          }
        }, i * 900)
      }

      setTimeout(() => { if (!cancelled) run() }, 7 * 900 + 4000)
    }

    run()
    return () => { cancelled = true }
  }, [])

  const m = METER[meterLevel]

  return (
    <div style={{ borderRadius: 24, border: '2px solid #E4E1F0', overflow: 'hidden', background: '#F5F3FC' }}>

      {/* Chat header */}
      <div style={{ background: 'linear-gradient(180deg, #534AB7, #36307A)', padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>
            📚
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Study group</div>
            <div style={{ color: 'rgba(255,255,255,0.70)', fontSize: 11 }}>Classroom · 6 members</div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
            background: m.bg, border: `1px solid ${m.border}`,
            borderRadius: 9999, padding: '4px 10px',
            transition: 'all 0.4s ease',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: m.dot, transition: 'background 0.4s' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: m.text, transition: 'color 0.4s' }}>{m.label}</span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div style={{ minHeight: 228, maxHeight: 300, overflowY: 'auto', paddingTop: 10, paddingBottom: 6 }}>

        {/* AI insight strip */}
        {showInsight && (
          <div
            key={insightText}
            style={{
              margin: '0 14px 8px',
              background: m.insightBg, border: `1px solid ${m.insightBorder}`,
              borderRadius: 12, padding: '8px 12px', fontSize: 12,
              color: m.insightText,
              animation: 'cvFadeUp 0.30s ease both',
            }}
          >
            <span style={{ fontWeight: 700 }}>AI insight: </span>{insightText}
          </div>
        )}

        {/* Messages */}
        {MESSAGES.slice(0, visibleCount).map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: msg.isOwn ? 'row-reverse' : 'row',
              alignItems: 'flex-end',
              gap: 7,
              padding: '3px 14px',
              animation: 'cvFadeUp 0.28s ease both',
            }}
          >
            {!msg.isOwn && (
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: msg.avatarColor, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 10, fontWeight: 700,
              }}>
                {msg.initials}
              </div>
            )}
            <div style={{ maxWidth: '72%' }}>
              {!msg.isOwn && (
                <div style={{ fontSize: 10, color: '#9996AD', marginBottom: 2, paddingLeft: 2 }}>
                  {msg.author}
                </div>
              )}
              <div style={{
                background:   msg.isOwn ? '#534AB7' : '#ffffff',
                color:        msg.isOwn ? '#ffffff' : '#1C1B2E',
                borderRadius: msg.isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '7px 11px', fontSize: 12,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {/* Guidance card */}
        {showGuidance && (
          <div style={{
            margin: '6px 14px 4px',
            background: '#EBE9F7', border: '1px solid #BFB9E4',
            borderRadius: 16, padding: '12px 14px',
            animation: 'cvFadeUp 0.40s ease both',
            position: 'relative',
          }}>
            <span style={{
              position: 'absolute', top: 10, right: 12,
              fontSize: 13, color: '#9996AD', lineHeight: 1,
            }}>✕</span>
            <div style={{
              fontSize: 10, fontWeight: 700, color: '#453DA0',
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6,
            }}>
              A moment to reflect
            </div>
            <div style={{ fontSize: 12, color: '#1C1B2E', lineHeight: 1.55 }}>
              We see what is happening here. What is being done to you is not okay.
              You did not cause this and you do not deserve it.
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div style={{
        background: '#fff', borderTop: '1px solid #E4E1F0',
        padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          flex: 1, background: '#F5F3FC', borderRadius: 9999,
          padding: '7px 14px', fontSize: 12, color: '#9996AD',
        }}>
          Message...
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: '#534AB7', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes cvFadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  )
}
