import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { referralCode } = await request.json()
    
    if (!referralCode) {
      return NextResponse.json({ error: 'Referral code required' }, { status: 400 })
    }
    
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .rpc('validate_referral_code', {
        p_referral_code: referralCode
      })
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error validating referral:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}