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
        },
      }
    )
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || user.id
    
    // Get user badges
    const { data: badges, error: badgesError } = await supabase
      .rpc('get_user_badges', {
        p_user_id: userId
      })
    
    if (badgesError) throw badgesError
    
    // Get badge stats
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}