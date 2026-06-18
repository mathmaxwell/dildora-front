// Groq API — free, no credit card needed
// Sign up: https://console.groq.com → API Keys → add to .env as GROQ_API_KEY=...

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile' // free, high quality

export async function* streamAnalysis(prompt: string): AsyncGenerator<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) throw new Error('NO_KEY')

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      max_tokens: 2048,
      temperature: 0.4,
    }),
  })

  if (!response.ok) {
    if (response.status === 429) throw new Error('RATE_LIMIT')
    throw new Error(`HTTP ${response.status}`)
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const lines = decoder
      .decode(value, { stream: true })
      .split('\n')
      .filter((l) => l.startsWith('data: '))

    for (const line of lines) {
      const data = line.slice(6).trim()
      if (data === '[DONE]') return
      try {
        const delta = JSON.parse(data)?.choices?.[0]?.delta?.content
        if (delta) yield delta
      } catch {
        // skip malformed SSE chunks
      }
    }
  }
}
