import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { userId } = await request.json()
    
    const { data, error } = await supabase
      .rpc('unfollow_user', {
        p_follower_id: user.id,
        p_following_id: userId
      })
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in unfollow API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}