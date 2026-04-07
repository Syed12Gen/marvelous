import SignupForm from '@/components/SignupForm'

export const metadata = { title: 'Create account — Marvelous' }

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Join Marvelous</h1>
        <p className="mb-6 text-sm text-gray-500">
          An AI-powered chat that helps keep conversations kind.
        </p>
        <SignupForm />
      </div>
    </main>
  )
}
