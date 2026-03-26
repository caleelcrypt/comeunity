import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('own_referral_code, referral_invites, referral_xp_earned')
      .eq('id', user.id)
      .single()
    
    if (profileError) throw profileError
    
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}