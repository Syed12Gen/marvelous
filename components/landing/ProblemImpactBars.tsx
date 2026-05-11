'use client'

const whoBars = [
  { label: 'Classrooms',      width: '85%' },
  { label: 'Friend groups',   width: '72%' },
  { label: 'Online chats',    width: '68%' },
  { label: 'Teams / clubs',   width: '54%' },
]

const impactBars = [
  { label: 'Anxiety / depression', width: '78%' },
  { label: 'Social withdrawal',    width: '66%' },
  { label: 'Academic impact',      width: '60%' },
  { label: 'Self-harm risk',       width: '45%' },
]

function BarList({ title, bars }: { title: string; bars: { label: string; width: string }[] }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="text-xs font-semibold tracking-[0.2em] text-violet-200/90 mb-4">{title}</h3>
      <div className="space-y-3">
        {bars.map(({ label, width }) => (
          <div key={label}>
            <div className="text-xs text-white/70 mb-1.5">{label}</div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                style={{ width }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProblemImpactBars() {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4 mb-2">
        <BarList title="WHO GETS AFFECTED" bars={whoBars} />
        <BarList title="LONG-TERM IMPACT"  bars={impactBars} />
      </div>
      <div className="text-[10px] text-white/40 italic text-center mb-8">
        Preview data visualization — for product demo only.
      </div>
    </>
  )
}
