import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import CreateGroupForm from '@/components/CreateGroupForm'

export const metadata = { title: 'Create a group — Marvelous' }

export default async function CreateGroupPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Create a group</h1>
        <p className="mb-6 text-sm text-gray-500">
          Give your group a name and type. You&apos;ll get an ID to share with others.
        </p>
        <CreateGroupForm />
      </div>
    </main>
  )
}
