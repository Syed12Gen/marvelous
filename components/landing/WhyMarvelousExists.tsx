'use client'

import { Quote } from 'lucide-react'
import ProblemStatsGrid from './ProblemStatsGrid'
import ProblemImpactBars from './ProblemImpactBars'

export default function WhyMarvelousExists() {
  return (
    <div className="animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] tracking-[0.3em] text-violet-300/80 font-semibold">
          THE PROBLEM
        </span>
        <h2 className="mt-2 text-3xl lg:text-4xl font-semibold text-white leading-tight">
          Bullying is bigger than{' '}
          <span className="text-gradient-violet">most people see.</span>
        </h2>
      </div>

      <ProblemStatsGrid />
      <ProblemImpactBars />

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-rose-500/25 p-5">
          <h3 className="text-sm font-semibold text-rose-200 mb-3">Without intervention</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex gap-2"><span className="text-rose-400">•</span> Conflict escalates quietly</li>
            <li className="flex gap-2"><span className="text-rose-400">•</span> Targets become isolated</li>
            <li className="flex gap-2"><span className="text-rose-400">•</span> Withdrawal from group spaces</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-emerald-500/25 p-5">
          <h3 className="text-sm font-semibold text-emerald-200 mb-3">With early detection</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex gap-2"><span className="text-emerald-400">•</span> Faster, calmer resolution</li>
            <li className="flex gap-2"><span className="text-emerald-400">•</span> Restored trust in the group</li>
            <li className="flex gap-2"><span className="text-emerald-400">•</span> Healthier group dynamics</li>
          </ul>
        </div>
      </div>

      <div className="relative rounded-2xl glass-card shadow-glow p-6 pl-7 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-blue-500" />
        <Quote className="w-5 h-5 text-violet-300/70 mb-2" />
        <p className="text-base lg:text-lg italic text-white/85 leading-relaxed">
          &ldquo;What looks like a joke in a group chat is often the earliest visible signal of exclusion.&rdquo;
        </p>
        <div className="mt-3 text-xs text-white/45">
          — Grounded in behavioral research on adolescent group dynamics
        </div>
      </div>
    </div>
  )
}
