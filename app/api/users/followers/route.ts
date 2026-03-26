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
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'recent'
    
    const { data, error } = await supabase
      .rpc('get_user_followers', {
        p_user_id: userId,
        p_limit: limit,
        p_offset: offset,
        p_sort_by: sortBy
      })
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in followers API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}