'use client'

import { Sparkles, Shield, Send, Users } from 'lucide-react'
import {
  DEMO_SCRIPT,
  DEMO_STATUS_STYLES,
  demoStatusFor,
  demoToneClass,
} from './chatDemoData'

interface Props {
  count:        number
  showInsight:  boolean
  showSupport:  boolean
}

export default function ChatDemoFrame({ count, showInsight, showSupport }: Props) {
  const status = demoStatusFor(count)
  const s      = DEMO_STATUS_STYLES[status]

  return (
    <div
      className="w-full max-w-lg rounded-3xl glass-card border border-violet-500/30 shadow-glow-lg overflow-hidden flex flex-col"
      style={{ minHeight: 640 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Study group</div>
            <div className="text-[11px] text-white/50">6 members</div>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors duration-500 ${s.wrap}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${s.dot}`} />
          <span className={`text-[10px] font-semibold tracking-wide ${s.text}`}>{s.label}</span>
        </div>
      </div>

      {/* AI Insight banner */}
      {showInsight && (
        <div className="mx-4 mt-4 rounded-xl p-3 bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/30 flex items-start gap-2.5 animate-scale-in">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0 shadow-[0_0_18px_-4px_rgba(139,92,246,0.7)]">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold text-violet-200 tracking-wide">AI INSIGHT</div>
            <div className="text-xs text-white/85 mt-0.5">
              Repeated targeting toward Sara detected.
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 px-4 py-4 space-y-2.5 overflow-hidden">
        {DEMO_SCRIPT.slice(0, count).map((m, i) => (
          <div key={i} className="animate-fade-in">
            <div className="flex items-baseline gap-2 mb-0.5 px-1">
              <span className="text-[11px] font-semibold text-white/70">{m.who}</span>
              <span className="text-[10px] text-white/35">{m.time}</span>
            </div>
            <div className={`inline-block max-w-[85%] rounded-2xl rounded-tl-sm border px-3 py-1.5 text-sm ${demoToneClass(m.tone)}`}>
              {m.text}
            </div>
          </div>
        ))}

        {showSupport && (
          <div className="mt-3 animate-scale-in rounded-xl p-3 bg-violet-500/10 border border-violet-500/30 shadow-[0_0_24px_-8px_rgba(139,92,246,0.6)]">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-violet-300" />
              <span className="text-[11px] font-semibold text-violet-200 tracking-wide">
                PRIVATE SUPPORT FOR SARA
              </span>
            </div>
            <div className="text-xs text-white/85 italic">
              &ldquo;You&apos;re not the problem. This conversation is targeting you — and support is available.&rdquo;
            </div>
          </div>
        )}
      </div>

      {/* Disabled input */}
      <div className="px-4 py-3 border-t border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2 rounded-full bg-white/[0.03] border border-white/10 px-4 py-2 opacity-60">
          <input
            disabled
            placeholder="Type a message…"
            className="flex-1 bg-transparent text-sm text-white/50 placeholder:text-white/30 outline-none cursor-not-allowed"
          />
          <button
            type="button"
            disabled
            className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center cursor-not-allowed"
            aria-label="Send (disabled in preview)"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
