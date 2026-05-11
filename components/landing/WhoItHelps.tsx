'use client'

import { Shield, HeartHandshake, Users } from 'lucide-react'

const roles = [
  {
    icon: Shield,
    title: 'Victim',
    ring:  'ring-violet-500/30',
    glow:  'from-violet-500/30 to-blue-500/30',
    body:  'Gets validation and protection. A private check-in arrives the moment exclusion is detected.',
  },
  {
    icon: HeartHandshake,
    title: 'Bully',
    ring:  'ring-amber-500/30',
    glow:  'from-amber-500/30 to-rose-500/30',
    body:  'Gets a calm, private nudge. No public shame — just a reflection prompt that invites change.',
  },
  {
    icon: Users,
    title: 'Bystander',
    ring:  'ring-cyan-500/30',
    glow:  'from-cyan-500/30 to-blue-500/30',
    body:  'Gets a specific action. A small, doable suggestion that turns silence into support.',
  },
]

export default function WhoItHelps() {
  return (
    <div className="animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] tracking-[0.3em] text-violet-300/80 font-semibold">
          WHO IT HELPS
        </span>
        <h2 className="mt-2 text-3xl lg:text-4xl font-semibold text-white leading-tight">
          Support for <span className="text-gradient-violet">everyone in the room.</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {roles.map(({ icon: Icon, title, ring, glow, body }) => (
          <div
            key={title}
            className={`rounded-2xl glass-card shadow-glow p-6 ring-1 ${ring} hover:shadow-glow-lg transition`}
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${glow} border border-white/10 flex items-center justify-center mb-4`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-white/65 leading-relaxed">{body}</p>
            <div className="mt-5 pt-4 border-t border-white/10 text-[10px] tracking-[0.25em] text-white/40 font-semibold">
              PRIVATE · IN-THE-MOMENT
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
