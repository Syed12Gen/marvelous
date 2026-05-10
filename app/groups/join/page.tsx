import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import JoinGroupForm from '@/components/JoinGroupForm'

export const metadata = { title: 'Join a group — Marvelous' }

export default async function JoinGroupPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  return (
    <main className="min-h-screen" style={{ background: 'var(--brand-primary-tint-2)' }}>

      {/* ── Purple gradient header ── */}
      <header
        style={{
          background:              'linear-gradient(180deg, #534AB7, #36307A)',
          borderBottomLeftRadius:  28,
          borderBottomRightRadius: 28,
          paddingBottom:           40,
          paddingTop:              40,
        }}
      >
        <div className="mx-auto max-w-sm px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className="flex items-center justify-center rounded-full bg-white font-bold"
              style={{ width: 36, height: 36, color: '#534AB7', fontSize: 16 }}
            >
              M
            </div>
            <span className="font-bold text-white" style={{ fontSize: 20 }}>Marvelous</span>
          </div>
          <p className="text-white font-medium" style={{ fontSize: 14, opacity: 0.85 }}>
            A kinder way to connect.
          </p>
        </div>
      </header>

      {/* ── Form card ── */}
      <div className="mx-auto max-w-sm px-4 -mt-6">
        <div
          className="rounded-2xl p-8"
          style={{
            background: '#ffffff',
            boxShadow:  '0 4px 24px rgba(83,74,183,0.10)',
            border:     '1px solid var(--ink-200)',
          }}
        >
          <h1
            className="mb-2 font-bold"
            style={{ fontSize: 22, color: 'var(--ink-900)' }}
          >
            Join a group
          </h1>
          <p className="mb-6 text-sm" style={{ color: 'var(--ink-500)' }}>
            Enter the group ID you were given, then tell us how you know these people.
          </p>
          <JoinGroupForm />
        </div>
      </div>

    </main>
  )
}
