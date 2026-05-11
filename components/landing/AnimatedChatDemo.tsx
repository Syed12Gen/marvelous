'use client'

import { useEffect, useState } from 'react'
import ChatDemoFrame from './ChatDemoFrame'
import { DEMO_SCRIPT } from './chatDemoData'

const steps = [
  { n: '01', title: 'Listen',     body: 'Marvelous watches for patterns across multiple messages.' },
  { n: '02', title: 'Recognize',  body: 'It looks for repeated targeting, exclusion, and pile-ons.' },
  { n: '03', title: 'Respond',    body: 'It sends private, role-aware guidance after the pattern is clear.' },
]

export default function AnimatedChatDemo() {
  const [count, setCount]             = useState(0)
  const [showInsight, setShowInsight] = useState(false)
  const [showSupport, setShowSupport] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setCount(DEMO_SCRIPT.length)
      setShowInsight(true)
      setShowSupport(true)
      return
    }

    const timers: number[] = []
    const run = () => {
      setCount(0)
      setShowInsight(false)
      setShowSupport(false)
      DEMO_SCRIPT.forEach((_, i) => {
        timers.push(window.setTimeout(() => setCount(i + 1), 600 + i * 900))
      })
      timers.push(window.setTimeout(() => setShowInsight(true),  600 + 6 * 900 + 400))
      timers.push(window.setTimeout(() => setShowSupport(true),  600 + 6 * 900 + 1400))
      timers.push(window.setTimeout(run, 600 + DEMO_SCRIPT.length * 900 + 6500))
    }
    run()
    return () => {
      timers.forEach((t) => clearTimeout(t))
    }
  }, [])

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
      <div className="lg:col-span-3 flex justify-center lg:justify-start">
        <ChatDemoFrame count={count} showInsight={showInsight} showSupport={showSupport} />
      </div>

      <div className="lg:col-span-2">
        <span className="text-[10px] tracking-[0.3em] text-violet-300/80 font-semibold">
          SEE HOW IT WORKS
        </span>
        <h2 className="mt-2 text-3xl lg:text-4xl font-semibold text-white leading-tight">
          From signals to <span className="text-gradient-violet">support.</span>
        </h2>
        <p className="mt-3 text-sm text-white/60 max-w-md">
          Marvelous reads the room. It distinguishes patterns from passing jokes — and quietly
          steps in when someone&apos;s getting pushed out.
        </p>

        <div className="mt-6 space-y-4">
          {steps.map((s) => (
            <div key={s.n} className="flex gap-3">
              <div className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 flex items-center justify-center text-[11px] font-semibold text-violet-200">
                {s.n}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{s.title}</div>
                <p className="text-xs text-white/60 leading-relaxed mt-0.5">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
