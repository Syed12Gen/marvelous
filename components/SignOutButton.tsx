'use client'

import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/supabase'

export default function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push('/auth/login')
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-full font-semibold transition-opacity hover:opacity-80"
      style={{
        background: 'rgba(255,255,255,0.14)',
        color: '#ffffff',
        fontSize: 13,
        padding: '6px 14px',
      }}
    >
      Sign out
    </button>
  )
}
