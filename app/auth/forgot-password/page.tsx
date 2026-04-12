'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess]       = useState<string | null>(null)
  const [debugOrigin, setDebugOrigin] = useState<string | null>(null)

  useEffect(() => {
    const baseUrlEnv = process.env.NEXT_PUBLIC_APP_URL
    const baseUrl = (baseUrlEnv && baseUrlEnv.trim().length > 0)
      ? baseUrlEnv.replace(/\/$/, '')
      : window.location.origin
    setDebugOrigin(baseUrl)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const baseUrlEnv = process.env.NEXT_PUBLIC_APP_URL
const baseUrl = (baseUrlEnv && baseUrlEnv.trim().length > 0)
  ? baseUrlEnv.replace(/\/$/, '')
  : window.location.origin

const redirectTo = `${baseUrl}/auth/reset-password`

    console.log('resetPasswordForEmail', { email, origin, redirectTo })

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })
      if (resetError) {
        console.error('resetPasswordForEmail error', resetError)
        throw resetError
      }
      setSuccess('Check your email for a reset link.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Reset your password</h1>
        <p className="mb-6 text-sm text-gray-500">
          Enter your email and we&apos;ll send you a link to choose a new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          {success && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </button>

          <p className="text-center text-sm text-gray-500">
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>

        {/* Debug panel — client-only (mounted after hydration to avoid SSR mismatch) */}
        {debugOrigin && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-xs text-gray-500 space-y-1">
            <p className="font-semibold text-gray-700">Debug</p>
            <p><span className="font-medium">origin:</span> {debugOrigin}</p>
            <p><span className="font-medium">redirectTo:</span> {debugOrigin}/auth/reset-password</p>
          </div>
        )}
      </div>
    </main>
  )
}
