import { useState } from 'react'
import { useFormStore } from '../store/formStore'
import { useEditStore } from '../store/editStore'
import { saveCard, updateCard } from '../services/cardService'

export type SaveStatus = 'idle' | 'saving' | 'ok' | 'error'

/**
 * Логика сохранения карты, общая для всех мест (нижняя панель, кнопки и т.п.).
 * Если активен режим редактирования — делает PUT, иначе POST.
 */
export function useSaveCard() {
  const editingId = useEditStore((s) => s.editingId)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const save = async () => {
    if (status === 'saving') return
    setStatus('saving')
    try {
      const form = useFormStore.getState()
      if (editingId !== null) await updateCard(editingId, form)
      else await saveCard(form)
      setStatus('ok')
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : String(e))
      setStatus('error')
    }
  }

  return {
    status,
    errorMsg,
    editing: editingId !== null,
    save,
    reset: () => setStatus('idle'),
  }
}
