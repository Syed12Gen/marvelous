'use client'

import { useState } from 'react'
import LandingHeader, { type LandingMode } from './LandingHeader'
import LoginHero from './LoginHero'
import PreviewAppView from './PreviewAppView'

export default function LandingClient() {
  const [mode, setMode] = useState<LandingMode>('login')

  return (
    <main className="min-h-screen bg-[#07060d] text-white">
      <LandingHeader mode={mode} onChange={setMode} />
      <div key={mode} className="animate-fade-in">
        {mode === 'login' ? <LoginHero /> : <PreviewAppView />}
      </div>
    </main>
  )
}
