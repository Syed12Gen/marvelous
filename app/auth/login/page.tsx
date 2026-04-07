import LoginForm from '@/components/LoginForm'

export const metadata = { title: 'Sign in — Marvelous' }

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Welcome back</h1>
        <LoginForm />
      </div>
    </main>
  )
}
