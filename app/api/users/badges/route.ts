import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || user.id
    
    const { data: badges, error: badgesError } = await supabase
      .rpc('get_user_badges', {
        p_user_id: userId
      })
    
    if (badgesError) throw badgesError
    
    const { data: stats, error: statsError } = await supabase
      .rpc('get_badge_stats', {
        p_user_id: userId
      })
    
    if (statsError) throw statsError
    
    return NextResponse.json({
      success: true,
      badges: badges,
      stats: stats
    })
    
  } catch (error) {
    console.error('Error in badges API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}