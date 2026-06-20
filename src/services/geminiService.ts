// AI-анализ карты. Запрос уходит на наш backend (POST /api/v1/analyze),
// который проксирует его в Groq своим ключом. На клиенте ключа НЕТ —
// GROQ_API_KEY живёт только на сервере.
import { apiUrl } from '../config/api'

export async function* streamAnalysis(prompt: string): AsyncGenerator<string> {
  const response = await fetch(apiUrl('analyze'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  if (!response.ok) {
    if (response.status === 429) throw new Error('RATE_LIMIT')
    if (response.status === 503) throw new Error('NO_KEY')
    throw new Error(`HTTP ${response.status}`)
  }

  // Backend отдаёт уже «очищенный» текст потоком (text/plain), просто
  // пробрасываем чанки наверх по мере поступления.
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    if (chunk) yield chunk
  }
}
