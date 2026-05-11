'use client'

import Link from 'next/link'

export type LandingMode = 'login' | 'preview'

interface Props {
  mode: LandingMode
  onChange: (m: LandingMode) => void
}

export default function LandingHeader({ mode, onChange }: Props) {
  const tabBase = 'px-4 h-8 text-sm font-medium rounded-full transition'
  const active   = 'bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-[0_0_20px_-4px_rgba(139,92,246,0.6)]'
  const inactive = 'text-white/60 hover:text-white/90'

  return (
    <header className="sticky top-0 z-50 h-14 px-4 lg:px-6 flex items-center justify-between bg-[#07060d]/70 backdrop-blur-xl border-b border-violet-500/15">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-violet-500 to-blue-500 shadow-[0_0_18px_-2px_rgba(139,92,246,0.7)]" />
        <span className="hidden sm:inline text-white font-semibold tracking-[0.2em] text-sm">
          MARVELOUS
        </span>
      </div>

      <div className="rounded-full p-1 bg-white/[0.04] border border-violet-500/20 backdrop-blur-md flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange('login')}
          className={`${tabBase} ${mode === 'login' ? active : inactive}`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => onChange('preview')}
          className={`${tabBase} ${mode === 'preview' ? active : inactive}`}
        >
          Preview App
        </button>
      </div>

      <Link
        href="/auth/signup"
        className="h-8 px-3 rounded-full border border-violet-500/30 bg-white/[0.03] hover:bg-white/[0.06] text-sm text-white/90 inline-flex items-center"
      >
        Create account
      </Link>
    </header>
  )
}
