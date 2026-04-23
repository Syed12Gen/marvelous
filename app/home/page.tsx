import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import SignOutButton from '@/components/SignOutButton'
import HomeClient from '@/components/HomeClient'
import type { User, MembershipWithGroup } from '@/lib/types'

export const metadata = { title: 'Home — Marvelous' }

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single<User>()

  if (!profile) redirect('/auth/login')

  const { data: memberships } = await supabase
    .from('group_members')
    .select('groups(id, name, group_type, created_by, no_exit_mode, created_at)')
    .eq('user_id', user.id)

  const groups = (memberships ?? [])
    .map((m) => (m as unknown as MembershipWithGroup).groups)
    .filter(Boolean)

  const firstName = profile.name.split(' ')[0]
  // streak field not yet in schema — defaults to 0
  const streak = 0

  return (
    <main className="min-h-screen" style={{ background: '#F5F3FC' }}>

      {/* ── Header ── */}
      <header
        style={{
          background:              'linear-gradient(180deg, #534AB7, #36307A)',
          borderBottomLeftRadius:  28,
          borderBottomRightRadius: 28,
          paddingBottom:           32,
        }}
      >
        <div className="mx-auto max-w-lg px-4 pt-5">

          {/* Top row: logo | streak + sign-out */}
          <div className="flex items-center justify-between mb-6">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-full bg-white font-bold"
                style={{ width: 32, height: 32, color: '#534AB7', fontSize: 14 }}
              >
                M
              </div>
              <span className="font-bold text-white" style={{ fontSize: 17 }}>Marvelous</span>
            </div>

            {/* Streak chip + sign-out */}
            <div className="flex items-center gap-2">
              {streak > 0 ? (
                <div
                  className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ background: 'rgba(255,255,255,0.18)' }}
                >
                  <span
                    className="flex items-center justify-center rounded-full bg-white font-bold"
                    style={{ width: 16, height: 16, color: '#534AB7', fontSize: 9 }}
                  >
                    ★
                  </span>
                  {streak}-day streak
                </div>
              ) : (
                <div
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)' }}
                >
                  Start your streak today
                </div>
              )}
              <SignOutButton />
            </div>
          </div>

          {/* Greeting */}
          <p className="font-medium text-white" style={{ fontSize: 14, opacity: 0.8 }}>
            Hey, {firstName} 👋
          </p>
          <p className="font-bold text-white mt-0.5" style={{ fontSize: 22 }}>
            Let&apos;s keep it kind today.
          </p>
        </div>
      </header>

      {/* ── Body (client component — handles hover/active interactions) ── */}
      <HomeClient communicationScore={profile.communication_score} groups={groups} />

    </main>
  )
}
