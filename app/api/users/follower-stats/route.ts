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
    
    const { data, error } = await supabase
      .rpc('get_follower_stats', {
        p_user_id: userId
      })
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in follower stats API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}