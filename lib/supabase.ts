import { createBrowserClient } from '@supabase/ssr'
import type { User } from '@/lib/types'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// ============================================================
// Auth
// ============================================================

export async function signUp(
  email: string,
  password: string,
  name: string,
): Promise<void> {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  if (!data.user) throw new Error('Sign up failed — no user returned.')

  const { error: profileError } = await supabase.from('users').insert({
    id:    data.user.id,
    email,
    name,
  })
  if (profileError) throw profileError
}

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ============================================================
// User profile
// ============================================================

export async function getUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data as User
}
