import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import JoinGroupForm from '@/components/JoinGroupForm'

export const metadata = { title: 'Join a group — Marvelous' }

export default async function JoinGroupPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Join a group</h1>
        <p className="mb-6 text-sm text-gray-500">
          Enter the group ID you were given, then tell us how you know these people.
        </p>
        <JoinGroupForm />
      </div>
    </main>
  )
}
