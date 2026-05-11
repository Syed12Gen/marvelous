'use client'

import Link from 'next/link'
import GlowOrb from '@/components/effects/GlowOrb'

export default function PreviewCta() {
  return (
    <div className="animate-fade-in relative overflow-hidden rounded-2xl glass-card shadow-glow-lg">
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center"
        style={{ minHeight: 220 }}
      >
        <div className="p-8 lg:p-10 relative z-10">
          <span className="text-[10px] tracking-[0.3em] text-violet-300/80 font-semibold">
            GET STARTED
          </span>
          <h3 className="mt-2 text-2xl lg:text-3xl font-semibold text-white leading-tight">
            Ready to make your group <span className="text-gradient-violet">kinder?</span>
          </h3>
          <p className="mt-3 text-sm text-white/65 max-w-md">
            Start building safer group spaces in minutes.
          </p>
          <Link
            href="/auth/signup"
            className="mt-5 inline-flex h-10 px-5 items-center rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white text-sm font-medium hover:shadow-[0_8px_24px_-6px_rgba(139,92,246,0.6)] transition"
          >
            Get started
          </Link>
        </div>
        <div className="relative h-[220px]">
          <GlowOrb className="absolute inset-0" />
        </div>
      </div>
    </div>
  )
}
