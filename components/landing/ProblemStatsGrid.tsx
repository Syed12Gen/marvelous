'use client'

import { Users, EyeOff, MessageSquare, HeartPulse, Clock, GraduationCap } from 'lucide-react'

const stats = [
  { icon: Users,          value: '1 in 5',         label: 'students report being bullied',         source: 'CDC / NCES' },
  { icon: EyeOff,         value: '40%',            label: 'did not tell an adult in serious cases', source: 'Youth2000 report' },
  { icon: MessageSquare,  value: '21–58%',         label: 'of bullied students told a teacher',     source: 'Bjereld et al., 2024' },
  { icon: HeartPulse,     value: 'Higher risk',    label: 'of depression, anxiety, and self-harm',  source: 'StopBullying.gov / Psychiatry Research' },
  { icon: Clock,          value: 'Can persist',    label: 'for years without support',              source: 'Longitudinal bullying research' },
  { icon: GraduationCap,  value: 'Academic impact', label: 'lower participation, grades, attendance', source: 'StopBullying.gov' },
]

export default function ProblemStatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {stats.map(({ icon: Icon, value, label, source }) => (
        <div key={label} className="glass-card shadow-glow rounded-2xl p-5 flex flex-col h-full">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500/30 to-blue-500/30 border border-violet-500/30 flex items-center justify-center mb-3">
            <Icon className="w-4 h-4 text-violet-200" />
          </div>
          <div className="text-2xl font-bold text-gradient-violet leading-tight">{value}</div>
          <p className="mt-1 text-sm text-white/70 leading-snug">{label}</p>
          <div className="mt-auto pt-3 border-t border-white/10">
            <div className="text-[10px] uppercase tracking-wider text-white/40">{source}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
