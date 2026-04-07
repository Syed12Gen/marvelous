import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import SignOutButton from '@/components/SignOutButton'
import type { User } from '@/lib/types'

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

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <span className="text-lg font-bold text-gray-900">Marvelous</span>
          <SignOutButton />
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-8 space-y-6">
        {/* User card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <p className="text-sm text-gray-500">Signed in as</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">{profile.name}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">Communication score</span>
            <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-semibold text-indigo-700">
              {profile.communication_score}
            </span>
          </div>
        </div>

        {/* Groups */}
        <div>
          <h2 className="mb-3 text-base font-semibold text-gray-900">Your groups</h2>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 text-center">
            <p className="text-sm text-gray-500">
              No groups yet — create one to get started.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
