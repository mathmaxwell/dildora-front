import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FormState } from '../types/form'
import { useFormStore } from './formStore'

interface EditStore {
  // id редактируемой карты (null = создаём новую).
  editingId: number | null
  // ФИО для индикатора "вы редактируете ...".
  editingName: string

  // Загрузить карту в форму и перейти в режим редактирования.
  startEdit: (id: number, name: string, data: FormState) => void
  // Сбросить форму и выйти в режим создания новой карты.
  startNew: () => void
}

export const useEditStore = create<EditStore>()(
  persist(
    (set) => ({
      editingId: null,
      editingName: '',

      startEdit: (id, name, data) => {
        // reset() ставит чистую форму, затем накладываем данные карты —
        // так не остаётся "хвостов" от предыдущей карты.
        useFormStore.getState().reset()
        useFormStore.setState(data)
        set({ editingId: id, editingName: name })
      },

      startNew: () => {
        useFormStore.getState().reset()
        set({ editingId: null, editingName: '' })
      },
    }),
    {
      // Чтобы после перезагрузки сохранение по-прежнему шло в ту же карту.
      name: 'dildora-edit',
      partialize: (s) => ({ editingId: s.editingId, editingName: s.editingName }),
    },
  ),
)
