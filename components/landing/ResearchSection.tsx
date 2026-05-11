'use client'

import { BookOpen, Lock, TrendingUp, Zap } from 'lucide-react'

const principles = [
  { n: '01', icon: BookOpen,   title: 'Bystander action',          body: 'Peer support tends to shift group dynamics faster than authority alone.' },
  { n: '02', icon: Lock,       title: 'Private feedback',          body: 'Quiet, private feedback is associated with less defensiveness than public correction.' },
  { n: '03', icon: TrendingUp, title: 'Progress over punishment',  body: 'Progress-based feedback supports lasting behavior change.' },
  { n: '04', icon: Zap,        title: 'Real-time nudges',          body: 'In-the-moment cues are generally more effective than delayed consequences.' },
]

export default function ResearchSection() {
  return (
    <div className="animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] tracking-[0.3em] text-violet-300/80 font-semibold">
          THE RESEARCH
        </span>
        <h2 className="mt-2 text-3xl lg:text-4xl font-semibold text-white leading-tight">
          Built on what actually <span className="text-gradient-violet">changes behavior.</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {principles.map(({ n, icon: Icon, title, body }) => (
          <div key={n} className="rounded-2xl glass-card shadow-glow p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500/25 to-blue-500/25 border border-violet-500/30 flex items-center justify-center">
                <Icon className="w-4 h-4 text-violet-200" />
              </div>
              <span className="text-[10px] tracking-[0.25em] text-white/35 font-semibold">
                PRINCIPLE {n}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="mt-1.5 text-xs text-white/60 leading-relaxed flex-1">{body}</p>
            <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-white/35 italic">
              Grounded in behavioral research
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
