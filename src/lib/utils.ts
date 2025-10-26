import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type QuizResponsePayload = {
  username: string
  quizId: number
  isScored: boolean
}

export const onSubmitQuiz = async (payload: QuizResponsePayload) => {
  const response = await fetch('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      timeCompleted: new Date().toISOString(),
    }),
  })

  const data = await response.json()

  return data
}