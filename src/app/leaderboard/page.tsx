import { supabaseServer } from '@/lib/supabase/server'
import { formatDistanceToNow } from 'date-fns'

export default async function LeaderboardPage() {
  // show quizzes 1..5
  const quizIds = [1, 2, 3, 4, 5]

  const { data, error } = await supabaseServer
    .from('results')
    .select('username, isScored, timeCompleted, quizId')
    .in('quizId', quizIds)
    .order('quizId', { ascending: true })

  if (error) {
    console.error(error)
    return <div className="p-6 text-red-500">Lỗi tải dữ liệu leaderboard</div>
  }

  if (!data || data.length === 0) {
    return <div className="p-6 text-gray-500">Chưa có ai tham gia các quiz 1–5</div>
  }

  const sortResults = (arr: any[]) =>
    arr.slice().sort((a, b) => {
      const scoreDiff = Number(b.isScored) - Number(a.isScored) // scored first
      if (scoreDiff !== 0) return scoreDiff
      const at = a.timeCompleted ? new Date(a.timeCompleted).getTime() : Number.MAX_SAFE_INTEGER
      const bt = b.timeCompleted ? new Date(b.timeCompleted).getTime() : Number.MAX_SAFE_INTEGER
      return at - bt
    })

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
      </div>
      <main className="max-w-2xl mx-auto p-6 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-center">🏆 Bảng xếp hạng Quiz 1–5</h1>

        {quizIds.map((qid) => {
          const items = data.filter((d: any) => Number(d.quizId) === qid)
          if (!items || items.length === 0) {
            return (
              <section key={qid} className="mb-6" >
                <h2 className="font-semibold mb-2">Quiz #{qid}</h2>
                <div className="p-4 text-gray-500">Chưa có ai tham gia quiz này</div>
              </section>
            )
          }

          const sorted = sortResults(items)

          return (
            <section key={qid} className="mb-6">
              <h2 className="font-semibold mb-2">Quiz #{qid}</h2>

              <div className="grid grid-cols-3 font-semibold border p-2">
                <div>Người chơi</div>
                <div className="text-center">Điểm</div>
                <div className="text-right">Hoàn thành</div>
              </div>

              {sorted.map((item: any, i: number) => (
                <div
                  key={`${qid}-${i}-${item.username}`}
                  className={`grid grid-cols-3 p-2 border ${item.isScored ? 'bg-green-50' : 'bg-gray-50'}`}
                >
                  <div>{item.username}</div>
                  <div className="text-center">{item.isScored ? 'Đúng' : 'Sai'}</div>
                  <div className="text-right text-lg text-gray-600">
                    {item.timeCompleted
                      ? formatDistanceToNow(new Date(item.timeCompleted), { addSuffix: true })
                      : '-'}
                  </div>
                </div>
              ))}
            </section>
          )
        })}
      </main>
    </div>
  )
}
