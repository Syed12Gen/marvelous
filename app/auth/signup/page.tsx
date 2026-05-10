import SignupForm from '@/components/SignupForm'

export const metadata = { title: 'Create account — Marvelous' }

export default function SignupPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#F5F3FC' }}>

      {/* ── Purple gradient header ── */}
      <header style={{
        background:              'linear-gradient(180deg, #534AB7, #36307A)',
        borderBottomLeftRadius:  28,
        borderBottomRightRadius: 28,
        padding:                 '36px 20px 52px',
        textAlign:               'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#534AB7', fontSize: 16, fontWeight: 700, flexShrink: 0,
          }}>
            M
          </div>
          <span style={{ color: '#ffffff', fontSize: 20, fontWeight: 700 }}>Marvelous</span>
        </div>
        <p style={{ color: '#ffffff', fontSize: 14, opacity: 0.85, margin: 0, fontWeight: 500 }}>
          A kinder way to connect.
        </p>
      </header>

      {/* ── Signup card (overlaps header) ── */}
      <div style={{ maxWidth: 420, margin: '-28px auto 0', padding: '0 16px 40px' }}>
        <div style={{
          background:   '#ffffff',
          borderRadius: 20,
          padding:      28,
          boxShadow:    '0 4px 24px rgba(83,74,183,0.12)',
          border:       '1px solid #E4E1F0',
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1C1B2E', margin: '0 0 6px' }}>
            Join Marvelous
          </h1>
          <p style={{ fontSize: 13, color: '#6B6880', margin: '0 0 20px', lineHeight: 1.5 }}>
            An AI-powered chat that helps keep conversations kind.
          </p>
          <SignupForm />
        </div>
      </div>

    </main>
  )
}
