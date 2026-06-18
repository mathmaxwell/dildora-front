import type { FormState } from '../types/form'

// Базовый адрес backend. По умолчанию — локальный сервер на :8080.
// Для прода задаётся через VITE_API_URL в .env.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export interface SavedCard {
  id: number
  fio: string
  phone: string
  created_at: string
}

/**
 * Сохраняет всю форму на backend. Тело запроса — это весь объект формы;
 * сервер кладёт его в JSONB, а ФИО/телефон вытаскивает в отдельные колонки.
 * Функции стора (setField и т.п.) JSON.stringify отбрасывает автоматически.
 */
export async function saveCard(form: FormState): Promise<SavedCard> {
  const res = await fetch(`${API_URL}/api/v1/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  })

  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const body = await res.json()
      if (body?.error) msg = body.error
    } catch {
      /* тело без JSON — оставляем код статуса */
    }
    throw new Error(msg)
  }

  return res.json()
}
