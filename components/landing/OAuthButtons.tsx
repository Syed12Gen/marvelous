'use client'

// TODO: wire up real Google/Microsoft OAuth via Supabase
// supabase.auth.signInWithOAuth({ provider: 'google' }) — needs provider
// to be enabled in the Supabase dashboard first.

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-4 h-4" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.3 7 29.4 5 24 5 16.3 5 9.7 9 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.3C29.4 35 26.8 36 24 36c-5.3 0-9.7-3.5-11.3-8l-6.5 5C9.5 39.9 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.3 5.3C40.9 35.4 44 30.1 44 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#7FBA00" d="M13 1h10v10H13z" />
      <path fill="#00A4EF" d="M1 13h10v10H1z" />
      <path fill="#FFB900" d="M13 13h10v10H13z" />
    </svg>
  )
}

export default function OAuthButtons() {
  const cls =
    'flex-1 h-10 inline-flex items-center justify-center gap-2 rounded-xl border border-violet-500/20 bg-white/[0.03] hover:bg-white/[0.07] text-sm text-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div className="flex gap-3">
      <button type="button" disabled className={cls} title="Coming soon">
        <GoogleIcon /> Google
      </button>
      <button type="button" disabled className={cls} title="Coming soon">
        <MicrosoftIcon /> Microsoft
      </button>
    </div>
  )
}
