'use client'

import WhyMarvelousExists from './WhyMarvelousExists'
import AnimatedChatDemo from './AnimatedChatDemo'
import WhoItHelps from './WhoItHelps'
import ResearchSection from './ResearchSection'
import PreviewCta from './PreviewCta'

export default function PreviewAppView() {
  return (
    <section className="relative bg-[#07060d] overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[480px] h-[480px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-8 py-16 space-y-28">
        <WhyMarvelousExists />
        <AnimatedChatDemo />
        <WhoItHelps />
        <ResearchSection />
        <PreviewCta />
      </div>
    </section>
  )
}
