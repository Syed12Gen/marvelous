'use client'

import { Shield, Users, Heart, ShieldCheck, Lock } from 'lucide-react'
import LoginCard from './LoginCard'
import ParticleWave from '@/components/effects/ParticleWave'

const whyFeatures = [
  { icon: Shield, title: 'Detect Early',        body: 'Spot risks in real time before they escalate.' },
  { icon: Users,  title: 'Protect Communities', body: 'Prevent harm before it spreads across groups.' },
  { icon: Heart,  title: 'Build Trust',         body: 'Create kinder, safer spaces for everyone.' },
]

const trustItems = [
  { icon: ShieldCheck, label: 'Privacy first. Security built in.' },
  { icon: Lock,        label: 'Your data is encrypted and protected.' },
  { icon: Users,       label: 'Trusted by schools, teams & communities.' },
]

export default function LoginHero() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden px-6 py-12 lg:py-16 bg-[#07060d]">
        <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        <div className="absolute left-0 right-0 top-[32%] h-[55%] pointer-events-none wave-mask-card opacity-80">
          <ParticleWave className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[10px] tracking-[0.18em] text-violet-200 mb-6">
            AI-POWERED BEHAVIOR INTELLIGENCE
          </span>

          <h1 className="text-4xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-white mb-5">
            Understand Behavior.
            <br />
            Build <span className="text-gradient-violet">Safer Communities.</span>
          </h1>

          <p className="max-w-xl mx-auto text-base text-white/60 leading-relaxed mb-10">
            Marvelous uses AI to detect, analyze, and prevent harmful communication before it
            escalates.
          </p>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-lg">
          <div className="absolute inset-0 -m-8 bg-[#07060d]/70 blur-2xl rounded-[2rem] pointer-events-none" />
          <div className="relative">
            <LoginCard />
          </div>
        </div>
      </section>

      {/* WHY MARVELOUS EXISTS */}
      <section className="relative px-6 py-14 max-w-5xl mx-auto">
        <div className="h-px w-24 bg-white/10 mx-auto mb-6" />
        <h2 className="text-2xl lg:text-3xl font-semibold text-white text-center mb-10">
          Why Marvelous Exists
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {whyFeatures.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className={`flex flex-col items-center text-center px-6 py-2 ${
                i < whyFeatures.length - 1 ? 'md:border-r border-white/10' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                <Icon className="w-5 h-5 text-violet-300" />
              </div>
              <h3 className="text-white font-semibold mt-4 mb-2">{title}</h3>
              <p className="text-sm text-white/60 max-w-[14rem]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST ROW */}
      <section className="px-6 pb-12 pt-2 max-w-5xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {trustItems.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 text-xs text-white/50 justify-center md:justify-start"
            >
              <Icon className="w-4 h-4 text-violet-300/70" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
