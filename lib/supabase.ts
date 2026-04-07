import { createClient } from '@supabase/supabase-js'
import type { RelationshipTag, User } from '@/lib/types'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================
// Auth
// ============================================================

export async function signUp(
  email: string,
  password: string,
  name: string,
  relationshipTag: RelationshipTag,
): Promise<void> {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  if (!data.user) throw new Error('Sign up failed — no user returned.')

  const { error: profileError } = await supabase.from('users').insert({
    id:               data.user.id,
    email,
    name,
    relationship_tag: relationshipTag,
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
