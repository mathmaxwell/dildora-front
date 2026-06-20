import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Box, Typography, IconButton, Tooltip, TextField, InputAdornment,
  MenuItem, List, ListItem, ListItemText, Divider, CircularProgress, Alert,
  Snackbar, Button, Paper,
} from '@mui/material'
import {
  SearchRounded, EditRounded, DeleteRounded, RefreshRounded,
  AutoAwesomeRounded, AddRounded,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useTr } from '../hooks/useTr'
import { useEditStore } from '../store/editStore'
import { AiAnalysisDialog } from '../components/AiAnalysisDialog'
import { listCards, getCard, deleteCard, type SavedCard } from '../services/cardService'
import type { FormState } from '../types/form'

type SortKey = 'newest' | 'oldest' | 'name'

export function CardsPage() {
  const tr = useTr()
  const navigate = useNavigate()
  const { startEdit, startNew } = useEditStore()

  const [cards, setCards] = useState<SavedCard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<number | null>(null)
  const [toast, setToast] = useState('')

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')

  // AI-анализ выбранной карты.
  const [analyzeForm, setAnalyzeForm] = useState<FormState | null>(null)
  const [analyzeOpen, setAnalyzeOpen] = useState(false)

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

  useEffect(() => { load() }, [])

  // Поиск (по ФИО и телефону) + сортировка.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? cards.filter((c) =>
          c.fio.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q))
      : cards
    const sorted = [...filtered]
    if (sort === 'name') sorted.sort((a, b) => a.fio.localeCompare(b.fio))
    else if (sort === 'oldest') sorted.sort((a, b) => a.created_at.localeCompare(b.created_at))
    else sorted.sort((a, b) => b.created_at.localeCompare(a.created_at))
    return sorted
  }, [cards, query, sort])

  const handleEdit = async (c: SavedCard) => {
    setBusyId(c.id)
    setError('')
    try {
      const full = await getCard(c.id)
      startEdit(c.id, c.fio || `#${c.id}`, full.data)
      navigate('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusyId(null)
    }
  }

  const handleAnalyze = async (c: SavedCard) => {
    setBusyId(c.id)
    setError('')
    try {
      const full = await getCard(c.id)
      setAnalyzeForm(full.data)
      setAnalyzeOpen(true)
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

  const handleNew = () => {
    startNew()
    navigate('/')
  }

  const fmtDate = (s?: string) => {
    if (!s) return ''
    const d = new Date(s)
    return isNaN(d.getTime()) ? '' : d.toLocaleString()
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 1 }}>
        <Typography variant="h5" fontWeight={700}>{tr.listTitle}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<AddRounded />} onClick={handleNew}
            sx={{ borderRadius: 3, fontWeight: 700 }}>
            {tr.newCard}
          </Button>
          <Tooltip title={tr.listRefresh}>
            <span>
              <IconButton onClick={load} disabled={loading}><RefreshRounded /></IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 1.5, mb: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder={tr.listSearchPh}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><SearchRounded fontSize="small" /></InputAdornment>
            ),
          }}
        />
        <TextField
          size="small"
          select
          label={tr.listSort}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="newest">{tr.sortNewest}</MenuItem>
          <MenuItem value="oldest">{tr.sortOldest}</MenuItem>
          <MenuItem value="name">{tr.sortName}</MenuItem>
        </TextField>
      </Paper>

      {error && <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>{error}</Alert>}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      )}

      {!loading && visible.length === 0 && !error && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
          {query ? tr.listNoMatch : tr.listEmpty}
        </Typography>
      )}

      {!loading && visible.length > 0 && (
        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <List disablePadding>
            {visible.map((c, i) => (
              <motion.div key={c.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
              >
                {i > 0 && <Divider component="li" />}
                <ListItem
                  secondaryAction={
                    busyId === c.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Box>
                        <Tooltip title={tr.aiButton}>
                          <IconButton edge="end" onClick={() => handleAnalyze(c)}
                            sx={{ color: '#7C3AED' }}>
                            <AutoAwesomeRounded />
                          </IconButton>
                        </Tooltip>
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
                  sx={{ px: 2 }}
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
        </Paper>
      )}

      <AiAnalysisDialog open={analyzeOpen} onClose={() => setAnalyzeOpen(false)} form={analyzeForm} />

      <Snackbar
        open={!!toast}
        autoHideDuration={2500}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>{toast}</Alert>
      </Snackbar>
    </Container>
  )
}
