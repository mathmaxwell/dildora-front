import { useState } from 'react'
import { Button, Snackbar, Alert, CircularProgress } from '@mui/material'
import { SaveRounded, CheckRounded } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useFormStore } from '../store/formStore'
import { useEditStore } from '../store/editStore'
import { useTr } from '../hooks/useTr'
import { saveCard, updateCard } from '../services/cardService'

const MotionButton = motion.create(Button)

type Status = 'idle' | 'saving' | 'ok' | 'error'

export function SaveButton() {
  const tr = useTr()
  const editingId = useEditStore((s) => s.editingId)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const editing = editingId !== null

  const handleSave = async () => {
    if (status === 'saving') return
    setStatus('saving')
    try {
      // getState() даёт всю форму целиком; функции стора уйдут при сериализации.
      const form = useFormStore.getState()
      if (editingId !== null) {
        await updateCard(editingId, form)
      } else {
        await saveCard(form)
      }
      setStatus('ok')
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : String(e))
      setStatus('error')
    }
  }

  const saving = status === 'saving'
  const saved = status === 'ok'
  const successMsg = editing ? tr.updateSuccess : tr.saveSuccess

  return (
    <>
      <MotionButton
        variant="outlined"
        size="large"
        fullWidth
        onClick={handleSave}
        disabled={saving}
        startIcon={
          saving ? <CircularProgress size={18} color="inherit" />
          : saved ? <CheckRounded />
          : <SaveRounded />
        }
        whileTap={{ scale: 0.97 }}
        sx={{
          mt: 1.5, py: 1.4, fontSize: 16, fontWeight: 700, borderRadius: 3, minHeight: 48,
          borderColor: saved ? 'success.main' : 'primary.main',
          color: saved ? 'success.main' : 'primary.main',
          borderWidth: 2,
          '&:hover': { borderWidth: 2 },
        }}
      >
        {saving ? tr.saveSaving : saved ? successMsg : editing ? tr.saveUpdate : tr.saveButton}
      </MotionButton>

      {/* Успех */}
      <Snackbar
        open={status === 'ok'}
        autoHideDuration={3000}
        onClose={() => setStatus('idle')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
          {successMsg}
        </Alert>
      </Snackbar>

      {/* Ошибка */}
      <Snackbar
        open={status === 'error'}
        autoHideDuration={5000}
        onClose={() => setStatus('idle')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
          {tr.saveError}{errorMsg ? `: ${errorMsg}` : ''}
        </Alert>
      </Snackbar>
    </>
  )
}
