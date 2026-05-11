// Demo content for the animated chat preview on the landing page.
// This is *display-only* fake data — not connected to the real chat.

export type DemoTone = 'neutral' | 'hostile' | 'exclude' | 'self'

export interface DemoMsg {
  who:  string
  time: string
  text: string
  tone: DemoTone
}

export const DEMO_SCRIPT: DemoMsg[] = [
  { who: 'Ali',  time: '10:02', text: 'did everyone finish q3?',                                       tone: 'neutral' },
  { who: 'Alex', time: '10:02', text: 'yeah, it was pretty easy',                                       tone: 'neutral' },
  { who: 'Sara', time: '10:03', text: "can someone explain it? I'm stuck",                              tone: 'neutral' },
  { who: 'Alex', time: '10:04', text: "Sara you're always behind",                                     tone: 'hostile' },
  { who: 'Sam',  time: '10:04', text: 'we literally have to slow down every time because of you Sara!!', tone: 'hostile' },
  { who: 'John', time: '10:05', text: "Sara, maybe don't join if you can't keep up",                    tone: 'exclude' },
  { who: 'Sara', time: '10:05', text: '...',                                                            tone: 'self'    },
]

export type DemoStatus = 'safe' | 'tension' | 'bullying'

export const demoStatusFor = (count: number): DemoStatus => {
  if (count >= 6) return 'bullying'
  if (count >= 4) return 'tension'
  return 'safe'
}

export interface DemoStatusStyle {
  label: string
  wrap:  string
  dot:   string
  text:  string
}

export const DEMO_STATUS_STYLES: Record<DemoStatus, DemoStatusStyle> = {
  safe: {
    label: 'SAFE',
    wrap:  'bg-emerald-500/15 border-emerald-500/30',
    dot:   'bg-emerald-400',
    text:  'text-emerald-200',
  },
  tension: {
    label: 'TENSION',
    wrap:  'bg-amber-500/15 border-amber-500/30',
    dot:   'bg-amber-400',
    text:  'text-amber-200',
  },
  bullying: {
    label: 'BULLYING',
    wrap:  'bg-rose-500/15 border-rose-500/30',
    dot:   'bg-rose-400',
    text:  'text-rose-200',
  },
}

export const demoToneClass = (t: DemoTone): string => {
  switch (t) {
    case 'hostile': return 'bg-rose-500/10 border-rose-500/30 text-rose-100'
    case 'exclude': return 'bg-amber-500/10 border-amber-500/30 text-amber-100'
    case 'self':    return 'bg-white/[0.04] border-white/10 text-white/70 italic'
    default:        return 'bg-white/[0.04] border-white/10 text-white/85'
  }
}
