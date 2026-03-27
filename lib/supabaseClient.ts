// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
})

// Add this helper to check and refresh session
export const checkAndRefreshSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Session error:', error)
    // If token expired, sign out
    if (error.message?.includes('expired') || error.message?.includes('invalid')) {
      await supabase.auth.signOut()
      if (typeof window !== 'undefined') {
        window.location.href = '/auth'
      }
    }
    return null
  }
  
  return session
}