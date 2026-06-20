import type { FormState } from '../types/form'
import { apiUrl } from '../config/api'

export interface SavedCard {
  id: number
  fio: string
  phone: string
  created_at: string
  updated_at?: string
}

// Полная карта с данными формы (приходит из GET /cards/{id}).
export interface FullCard extends SavedCard {
  data: FormState
}

/** Достаёт текст ошибки из тела ответа, иначе — код статуса. */
async function errorFrom(res: Response): Promise<string> {
  try {
    const body = await res.json()
    if (body?.error) return body.error
  } catch {
    /* тело без JSON */
  }
  return `HTTP ${res.status}`
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
  if (!res.ok) throw new Error(await errorFrom(res))
  return res.json()
}

/** Список всех сохранённых карт (без данных формы). */
export async function listCards(): Promise<SavedCard[]> {
  const res = await fetch(apiUrl('cards'))
  if (!res.ok) throw new Error(await errorFrom(res))
  return res.json()
}

/** Одна карта целиком — с данными формы (для просмотра/редактирования). */
export async function getCard(id: number): Promise<FullCard> {
  const res = await fetch(apiUrl(`cards/${id}`))
  if (!res.ok) throw new Error(await errorFrom(res))
  return res.json()
}

/** Перезаписывает существующую карту новыми данными формы. */
export async function updateCard(id: number, form: FormState): Promise<SavedCard> {
  const res = await fetch(apiUrl(`cards/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  })
  if (!res.ok) throw new Error(await errorFrom(res))
  return res.json()
}

/** Удаляет карту по id. */
export async function deleteCard(id: number): Promise<void> {
  const res = await fetch(apiUrl(`cards/${id}`), { method: 'DELETE' })
  if (!res.ok) throw new Error(await errorFrom(res))
}
