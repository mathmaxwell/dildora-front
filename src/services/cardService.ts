import type { FormState } from '../types/form'
import { apiUrl } from '../config/api'

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
  const res = await fetch(apiUrl('cards'), {
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
