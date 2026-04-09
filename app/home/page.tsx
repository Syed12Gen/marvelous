import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import SignOutButton from '@/components/SignOutButton'
import type { User, MembershipWithGroup, GroupType } from '@/lib/types'

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

  const GROUP_TYPE_LABELS: Record<GroupType, string> = {
    classroom:    'Classroom',
    workplace:    'Workplace',
    friend_group: 'Friend group',
    family:       'Family',
  }

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
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Your groups</h2>
            <div className="flex gap-2">
              <Link
                href="/groups/join"
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Join
              </Link>
              <Link
                href="/groups/create"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                + Create
              </Link>
            </div>
          </div>

          {groups.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 text-center">
              <p className="text-sm text-gray-500">
                No groups yet — create one to get started.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {groups.map((group) => (
                <li key={group.id}>
                  <Link
                    href={`/groups/${group.id}/chat`}
                    className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-gray-200 hover:ring-indigo-300 transition-shadow"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{group.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {GROUP_TYPE_LABELS[group.group_type]}
                      </p>
                    </div>
                    <span className="text-gray-400 text-sm">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
