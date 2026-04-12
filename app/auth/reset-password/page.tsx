'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [checkingSession, setCheckingSession] = useState(true)
  const [exchanging, setExchanging]           = useState(false)
  const [hasSession, setHasSession]           = useState(false)
  const [password, setPassword]               = useState('')
  const [confirm, setConfirm]                 = useState('')
  const [loading, setLoading]                 = useState(false)
  const [error, setError]                     = useState<string | null>(null)
  const [done, setDone]                       = useState(false)

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')

    if (code) {
      setExchanging(true)
      // PKCE flow: exchange the code from the URL for a session.
      // On success, onAuthStateChange will fire PASSWORD_RECOVERY and handle state.
      // On failure, show "Link missing or expired".
      void supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setExchanging(false)
          setCheckingSession(false)
          // hasSession stays false → "Link missing or expired" renders
        }
        // success path: exchanging stays true until PASSWORD_RECOVERY fires
      })
    } else {
      // No code in URL — check if a session already exists (e.g. page refresh)
      void supabase.auth.getSession().then(({ data }) => {
        setHasSession(!!data.session)
        setCheckingSession(false)
      })
    }

    // Only respond to PASSWORD_RECOVERY — not generic SIGNED_IN events,
    // which would incorrectly grant access to already-logged-in users.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setExchanging(false)
        setHasSession(true)
        setCheckingSession(false)
      }
    })

    return () => { subscription.unsubscribe() }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      await supabase.auth.signOut()
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">

        {(checkingSession || exchanging) ? (
          <p className="text-center text-sm text-gray-500">Checking reset link…</p>
        ) : !hasSession ? (
          <>
            <h1 className="mb-3 text-2xl font-bold text-gray-900">Link missing or expired</h1>
            <p className="mb-6 text-sm text-gray-500">
              This reset link is missing or expired. Please request a new password reset email.
            </p>
            <div className="space-y-3">
              <Link
                href="/auth/forgot-password"
                className="block w-full rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Request new link
              </Link>
              <p className="text-center text-sm text-gray-500">
                <Link href="/auth/login" className="font-medium text-indigo-600 hover:underline">
                  Back to sign in
                </Link>
              </p>
            </div>
          </>
        ) : done ? (
          <>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Choose a new password</h1>
            <div className="space-y-4">
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Password updated successfully.
              </p>
              <p className="text-center text-sm text-gray-500">
                <Link href="/auth/login" className="font-medium text-indigo-600 hover:underline">
                  Sign in with your new password
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">Choose a new password</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                  Confirm new password
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </>
        )}

      </div>
    </main>
  )
}
