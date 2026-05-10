import Link from 'next/link'
import LoginForm from '@/components/LoginForm'
import ChatPreview from '@/components/ChatPreview'

export const metadata = { title: 'Sign in — Marvelous' }

// SVG ring math — r=28, circumference≈175.93, 73% fill≈128.4
const RING_R    = 28
const RING_CIRC = 2 * Math.PI * RING_R
const RING_FILL = RING_CIRC * 0.73

export default function LoginPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#ffffff' }}>

      {/* hover styles for stat cards */}
      <style>{`
        .stat-card { cursor: pointer; transition: all 0.2s; }
        .stat-card:hover {
          background: #EBE9F7 !important;
          border-color: #BFB9E4 !important;
          transform: translateY(-2px);
        }
      `}</style>

      {/* ══════════════════════════════════════════════
          SECTION 1 — HERO HEADER (login card inside)
      ══════════════════════════════════════════════ */}
      <header style={{
        background: 'linear-gradient(180deg, #534AB7, #453DA0)',
        padding:    '36px 20px 60px',
        textAlign:  'center',
      }}>
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#534AB7', fontSize: 15, fontWeight: 700, flexShrink: 0,
          }}>
            M
          </div>
          <span style={{ color: '#ffffff', fontSize: 20, fontWeight: 700 }}>Marvelous</span>
        </div>

        {/* Tagline */}
        <p style={{ color: '#ffffff', fontSize: 13, opacity: 0.8, margin: '0 0 24px' }}>
          A kinder way to connect.
        </p>

        {/* Login card — inside the hero */}
        <div style={{ maxWidth: 420, margin: '0 auto' }}>
          <div style={{
            background:   '#ffffff',
            borderRadius: 20,
            padding:      28,
            boxShadow:    '0 4px 24px rgba(83,74,183,0.18)',
            border:       '1px solid #E4E1F0',
            textAlign:    'left',
          }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1C1B2E', margin: '0 0 20px' }}>
              Welcome back
            </h1>
            <LoginForm />
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════
          SECTION 2 — STATS + STORY — #ffffff
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#ffffff' }}>
        <div style={{ maxWidth: 420, margin: '0 auto', padding: '32px 20px' }}>

          <p style={{
            fontSize: 11, fontWeight: 700, color: '#534AB7',
            textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14,
          }}>
            Why Marvelous exists
          </p>

          {/* 3 stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { stat: '1 in 5', desc: 'students report being bullied at school' },
              { stat: '40%',    desc: 'of online bullying goes unreported' },
              { stat: '58%',    desc: 'of kids never tell an adult what happened' },
            ].map(({ stat, desc }) => (
              <div
                key={stat}
                className="stat-card"
                style={{
                  background:   '#F5F3FC',
                  border:       '1px solid #E4E1F0',
                  borderRadius: 12,
                  padding:      '12px 8px',
                  textAlign:    'center',
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 700, color: '#534AB7', lineHeight: 1.1 }}>{stat}</div>
                <div style={{ fontSize: 10, color: '#6B6880', marginTop: 4, lineHeight: 1.4 }}>{desc}</div>
                <div style={{ fontSize: 10, color: '#534AB7', opacity: 0.6, marginTop: 5 }}>Read the research →</div>
              </div>
            ))}
          </div>

          {/* Story card */}
          <div style={{
            marginTop:    10,
            background:   '#F5F3FC',
            border:       '1px solid #E4E1F0',
            borderLeft:   '3px solid #534AB7',
            borderRadius: '0 12px 12px 0',
            padding:      14,
          }}>
            <p style={{ fontStyle: 'italic', fontSize: 12, color: '#1C1B2E', lineHeight: 1.6, margin: 0 }}>
              &ldquo;The cruelest part of being bullied in a group chat is that everyone sees it —
              and nobody says anything. The silence felt worse than the words.&rdquo;
            </p>
            <p style={{ fontSize: 10, color: '#9996AD', marginTop: 6, marginBottom: 0 }}>
              — Yale Center for Emotional Intelligence, 2023
            </p>
          </div>

          <div style={{ height: 1, background: '#E4E1F0', marginTop: 8 }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 3 — CHAT PREVIEW — #F5F3FC
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#F5F3FC' }}>
        <div style={{ maxWidth: 420, margin: '0 auto', padding: '32px 20px' }}>

          <p style={{
            fontSize: 11, fontWeight: 700, color: '#534AB7',
            textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14,
          }}>
            See how it works
          </p>

          {/* Wrapper overrides any fixed height / overflow inside ChatPreview */}
          <div style={{ minHeight: 600, overflow: 'visible' }}>
            <ChatPreview />
          </div>

          <div style={{ height: 1, background: '#E4E1F0', marginTop: 8 }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 4 — ROLE CARDS — #ffffff
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#ffffff' }}>
        <div style={{ maxWidth: 420, margin: '0 auto', padding: '32px 20px' }}>

          <p style={{
            fontSize: 11, fontWeight: 700, color: '#534AB7',
            textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8,
          }}>
            Who it helps
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1C1B2E', margin: '0 0 6px' }}>
            Private guidance for everyone in the group
          </h2>
          <p style={{ fontSize: 13, color: '#6B6880', margin: '0 0 16px', lineHeight: 1.5 }}>
            Marvelous never calls anyone out publicly. Each person receives a private message
            tailored to their role.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>

            {/* Victim */}
            <div style={{ background: '#EBE9F7', border: '1px solid #BFB9E4', borderRadius: 16, padding: 16 }}>
              <div style={{
                width: 36, height: 36, background: '#DDD9F0', borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    stroke="#453DA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#453DA0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Victim
              </div>
              <p style={{ fontSize: 11, color: '#3F3D5C', lineHeight: 1.5, margin: '0 0 8px' }}>
                Gets a private message of validation first — then practical guidance on how to
                handle what is happening, in their own time.
              </p>
              <span style={{ fontSize: 10, fontWeight: 700, background: '#DDD9F0', color: '#453DA0', borderRadius: 9999, padding: '2px 8px' }}>
                Protected
              </span>
            </div>

            {/* Bully */}
            <div style={{ background: '#FFF3D9', border: '1px solid #FFD88A', borderRadius: 16, padding: 16 }}>
              <div style={{
                width: 36, height: 36, background: '#FFE8A0', borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#8A5A0B" strokeWidth="2" />
                  <path d="M12 8v4M12 16h.01" stroke="#8A5A0B" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8A5A0B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Bully
              </div>
              <p style={{ fontSize: 11, color: '#6B4A0A', lineHeight: 1.5, margin: '0 0 8px' }}>
                Gets a calm private nudge about how their messages may have landed — no public
                shaming, no lectures. Just reflection.
              </p>
              <span style={{ fontSize: 10, fontWeight: 700, background: '#FFE8A0', color: '#8A5A0B', borderRadius: 9999, padding: '2px 8px' }}>
                Redirected
              </span>
            </div>

            {/* Bystander */}
            <div style={{ background: '#E8F1E8', border: '1px solid #B9D8BA', borderRadius: 16, padding: 16 }}>
              <div style={{
                width: 36, height: 36, background: '#C8E6CA', borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#2F6B36" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="9" cy="7" r="4" stroke="#2F6B36" strokeWidth="2" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#2F6B36" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#2F6B36', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Bystander
              </div>
              <p style={{ fontSize: 11, color: '#1E4D24', lineHeight: 1.5, margin: '0 0 8px' }}>
                Gets one small specific action they can take — like sending a quick private message.
                Low risk, high impact.
              </p>
              <span style={{ fontSize: 10, fontWeight: 700, background: '#C8E6CA', color: '#2F6B36', borderRadius: 9999, padding: '2px 8px' }}>
                Empowered
              </span>
            </div>

          </div>

          <div style={{ height: 1, background: '#E4E1F0', marginTop: 8 }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 5 — SCORE SYSTEM + RESEARCH — #F5F3FC
      ══════════════════════════════════════════════ */}
      <section style={{ background: '#F5F3FC' }}>
        <div style={{ maxWidth: 420, margin: '0 auto', padding: '32px 20px' }}>

          <p style={{
            fontSize: 11, fontWeight: 700, color: '#534AB7',
            textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 8,
          }}>
            The score system
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1C1B2E', margin: '0 0 6px' }}>
            When people see their own patterns, they change
          </h2>
          <p style={{ fontSize: 13, color: '#6B6880', margin: '0 0 16px', lineHeight: 1.5 }}>
            The communication score is not a punishment — it is a mirror. It shows each person how
            their messages affect the group, privately.
          </p>

          {/* Score card */}
          <div style={{
            background:   '#ffffff',
            borderRadius: 20,
            border:       '1px solid #E4E1F0',
            padding:      20,
            boxShadow:    '0 2px 12px rgba(83,74,183,0.07)',
          }}>

            {/* Top row: ring + labels */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r={RING_R} stroke="#E4E1F0" strokeWidth="6" fill="none" />
                  <circle
                    cx="36" cy="36" r={RING_R}
                    stroke="#534AB7" strokeWidth="6" fill="none"
                    strokeDasharray={`${RING_FILL.toFixed(1)} ${RING_CIRC.toFixed(1)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 36 36)"
                  />
                </svg>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 700, color: '#1C1B2E',
                }}>73</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#6B6880', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Communication score
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1C1B2E', marginTop: 3 }}>
                  Hamza&apos;s progress
                </div>
                <div style={{
                  display: 'inline-block', marginTop: 6,
                  fontSize: 11, fontWeight: 700,
                  background: '#EBE9F7', color: '#453DA0',
                  borderRadius: 9999, padding: '3px 10px',
                }}>
                  +18 this month
                </div>
              </div>
            </div>

            {/* Weekly chart */}
            <div style={{ display: 'flex', height: 80, alignItems: 'flex-end', gap: 6, marginBottom: 16 }}>
              {[
                { label: 'W1', h: 28, color: '#E4E1F0' },
                { label: 'W2', h: 32, color: '#E4E1F0' },
                { label: 'W3', h: 42, color: '#BFB9E4' },
                { label: 'W4', h: 50, color: '#9990D4' },
                { label: 'W5', h: 60, color: '#7A71D4' },
                { label: 'W6', h: 72, color: '#534AB7' },
              ].map(({ label, h, color }) => (
                <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', height: h, background: color, borderRadius: '6px 6px 0 0' }} />
                  <div style={{ fontSize: 10, color: '#9996AD' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#E4E1F0', margin: '0 0 16px' }} />

            {/* Behavior breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Supportive messages',  pct: 78, color: '#534AB7' },
                { label: 'Hostile tone',          pct: 12, color: '#D94458' },
                { label: 'Neutral messages',      pct: 55, color: '#9990D4' },
                { label: 'Exclusionary language', pct:  8, color: '#F4A13B' },
              ].map(({ label, pct, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#3F3D5C', width: 110, flexShrink: 0 }}>{label}</span>
                  <div style={{ flex: 1, height: 6, background: '#F1EFF8', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 9999 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1C1B2E', width: 32, textAlign: 'right', flexShrink: 0 }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Research cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>

            <div style={{
              background: '#ffffff', borderRadius: 14, border: '1px solid #E4E1F0',
              padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 38, height: 38, background: '#EBE9F7', borderRadius: 10, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#534AB7" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#534AB7', marginBottom: 4 }}>
                  Self-awareness reduces aggression by 43%
                </div>
                <p style={{ fontSize: 12, color: '#6B6880', lineHeight: 1.5, margin: '0 0 5px' }}>
                  Private non-judgmental feedback drops aggressive behavior within 4 weeks.
                </p>
                <div style={{ fontSize: 10, color: '#9996AD', fontStyle: 'italic' }}>
                  Twemlow et al., Journal of School Violence, 2004
                </div>
              </div>
            </div>

            <div style={{
              background: '#ffffff', borderRadius: 14, border: '1px solid #E4E1F0',
              padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 38, height: 38, background: '#E8F1E8', borderRadius: 10, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"
                    stroke="#2F6B36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#2F6B36', marginBottom: 4 }}>
                  Progress visibility increases kind behavior by 2×
                </div>
                <p style={{ fontSize: 12, color: '#6B6880', lineHeight: 1.5, margin: '0 0 5px' }}>
                  Showing positive trends doubles the likelihood of continued improvement.
                </p>
                <div style={{ fontSize: 10, color: '#9996AD', fontStyle: 'italic' }}>
                  Yeager &amp; Dweck, Psychological Science, 2012
                </div>
              </div>
            </div>

            <div style={{
              background: '#ffffff', borderRadius: 14, border: '1px solid #E4E1F0',
              padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 38, height: 38, background: '#FFF3D9', borderRadius: 10, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#8A5A0B" strokeWidth="2" />
                  <polyline points="12 6 12 12 16 14"
                    stroke="#8A5A0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#8A5A0B', marginBottom: 4 }}>
                  Real-time feedback is 3× more effective than delayed
                </div>
                <p style={{ fontSize: 12, color: '#6B6880', lineHeight: 1.5, margin: '0 0 5px' }}>
                  Nudges delivered immediately after an action produce lasting change.
                </p>
                <div style={{ fontSize: 10, color: '#9996AD', fontStyle: 'italic' }}>
                  Fogg, Persuasive Technology Lab, Stanford, 2009
                </div>
              </div>
            </div>

          </div>

          <div style={{ height: 1, background: '#E4E1F0', marginTop: 8 }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 6 — FOOTER CTA — diagonal split
      ══════════════════════════════════════════════ */}
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <div style={{
          background:    '#534AB7',
          borderRadius:  20,
          overflow:      'hidden',
          position:      'relative',
          margin:        '24px 16px 40px',
          padding:       '32px 24px',
        }}>
          {/* Dark diagonal panel on right */}
          <div style={{
            position:  'absolute',
            top:       0,
            right:     0,
            width:     '50%',
            height:    '100%',
            background: '#453DA0',
            clipPath:  'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }} />

          {/* Content */}
          <div style={{
            position:        'relative',
            zIndex:          1,
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'space-between',
            gap:             16,
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 6, lineHeight: 1.3 }}>
                Ready to make your group kinder?
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
                Free to join. Works for any group.
              </div>
            </div>
            <Link
              href="/auth/signup"
              style={{
                background:     '#ffffff',
                color:          '#534AB7',
                borderRadius:   9999,
                padding:        '12px 20px',
                fontSize:       13,
                fontWeight:     700,
                whiteSpace:     'nowrap',
                flexShrink:     0,
                textDecoration: 'none',
                display:        'inline-block',
              }}
            >
              Get started →
            </Link>
          </div>
        </div>
      </div>

    </main>
  )
}
