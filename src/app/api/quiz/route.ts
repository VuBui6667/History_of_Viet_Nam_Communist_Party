import { supabaseServer } from '@/lib/supabase/server'

// ✅ POST: Lưu kết quả quiz
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, quizId, isScored, timeCompleted } = body

    if (!username || !quizId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Prevent the same username from submitting the same quiz more than once
    const { data: existing, error: fetchError } = await supabaseServer
      .from('results')
      .select('id')
      .eq('username', username)
      .eq('quizId', quizId)
      .limit(1)

    if (fetchError) throw fetchError
    if (existing && (existing as any).length > 0) {
      return Response.json({ success: false, error: 'Bạn đã tham gia quiz này' }, { status: 409 })
    }

    const { data, error } = await supabaseServer
      .from('results') // ← đổi tên nếu bảng bạn khác
      .insert([
        {
          username,
          quizId,
          isScored: isScored ?? false,
          timeCompleted: timeCompleted ?? new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error
    return Response.json({ success: true, data })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 400 })
  }
}

// ✅ GET: Lấy danh sách kết quả quiz
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const username = searchParams.get('username') ?? undefined
    const quizId = searchParams.get('quizId') ?? undefined

    let query = supabaseServer.from('results').select('*')

    if (username) query = query.eq('username', username)
    if (quizId) query = query.eq('quizId', quizId)

    const { data, error } = await query.order('timeCompleted', { ascending: false })
    if (error) throw error

    return Response.json({ success: true, data })
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 400 })
  }
}
