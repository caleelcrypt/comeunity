import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    
    const supabase = await createSupabaseServerClient()
    
    const { data, error } = await supabase
      .rpc('get_referral_leaderboard', {
        p_limit: limit
      })
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}