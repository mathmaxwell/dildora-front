import { useEffect, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, Box, Typography, IconButton,
  List, ListItem, ListItemText, CircularProgress, Alert, Tooltip,
  Divider, Snackbar,
} from '@mui/material'
import {
  CloseRounded, EditRounded, DeleteRounded, RefreshRounded,
  FolderOpenRounded,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useTr } from '../hooks/useTr'
import { useEditStore } from '../store/editStore'
import { listCards, getCard, deleteCard, type SavedCard } from '../services/cardService'

interface Props {
  open: boolean
  onClose: () => void
}

export function CardsList({ open, onClose }: Props) {
  const tr = useTr()
  const startEdit = useEditStore((s) => s.startEdit)

  const [cards, setCards] = useState<SavedCard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<number | null>(null)
  const [toast, setToast] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setCards(await listCards())
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  // Грузим список каждый раз при открытии.
  useEffect(() => {
    if (open) load()
  }, [open])

  const handleEdit = async (c: SavedCard) => {
    setBusyId(c.id)
    setError('')
    try {
      const full = await getCard(c.id)
      startEdit(c.id, c.fio || `#${c.id}`, full.data)
      onClose()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (c: SavedCard) => {
    if (!window.confirm(`${tr.listConfirmDelete}\n\n${c.fio || `#${c.id}`}`)) return
    setBusyId(c.id)
    setError('')
    try {
      await deleteCard(c.id)
      setCards((prev) => prev.filter((x) => x.id !== c.id))
      setToast(tr.listDeleted)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusyId(null)
    }
  }

  const fmtDate = (s?: string) => {
    if (!s) return ''
    const d = new Date(s)
    return isNaN(d.getTime()) ? '' : d.toLocaleString()
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FolderOpenRounded color="primary" />
              <Typography variant="h6" fontWeight={700}>{tr.listTitle}</Typography>
            </Box>
            <Box>
              <Tooltip title={tr.listRefresh}>
                <span>
                  <IconButton onClick={load} disabled={loading} size="small">
                    <RefreshRounded />
                  </IconButton>
                </span>
              </Tooltip>
              <IconButton onClick={onClose} size="small"><CloseRounded /></IconButton>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pb: 3 }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>{error}</Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && cards.length === 0 && !error && (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
              {tr.listEmpty}
            </Typography>
          )}

          {!loading && cards.length > 0 && (
            <List disablePadding>
              {cards.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  {i > 0 && <Divider component="li" />}
                  <ListItem
                    secondaryAction={
                      busyId === c.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Box>
                          <Tooltip title={tr.listEdit}>
                            <IconButton edge="end" onClick={() => handleEdit(c)} color="primary">
                              <EditRounded />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={tr.listDelete}>
                            <IconButton edge="end" onClick={() => handleDelete(c)} color="error">
                              <DeleteRounded />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )
                    }
                    sx={{ px: 0.5 }}
                  >
                    <ListItemText
                      primary={c.fio || `#${c.id}`}
                      secondary={[c.phone, fmtDate(c.created_at)].filter(Boolean).join(' · ')}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={!!toast}
        autoHideDuration={2500}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>{toast}</Alert>
      </Snackbar>
    </>
  )
}
