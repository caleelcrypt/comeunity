import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get referral data from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('own_referral_code, referral_invites, referral_xp_earned')
      .eq('id', user.id)
      .single()
    
    if (profileError) {
      console.error('Profile error:', profileError)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }
    
    // If profile has referral code, use it
    if (profile && profile.own_referral_code) {
      return NextResponse.json({
        success: true,
        data: {
          referral_code: profile.own_referral_code,
          total_invites: profile.referral_invites || 0,
          total_xp_earned: profile.referral_xp_earned || 0,
          referral_link: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/signup?ref=${profile.own_referral_code}`
        }
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'No referral code found'
    })
    
  } catch (error) {
    console.error('Error in referral API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}