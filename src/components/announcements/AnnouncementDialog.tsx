import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { createAnnouncement } from '../../services/announcementService'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/NotificationContext'

interface Props {
  open: boolean
  onClose: () => void
}

const AnnouncementDialog: React.FC<Props> = ({ open, onClose }) => {
  const { currentUser } = useAuth()
  const { showToast } = useToast()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [pinned, setPinned] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    setLoading(true)
    try {
      await createAnnouncement({ title, body, authorId: currentUser.uid, pinned })
      showToast('Announcement posted', 'success')
      setTitle('')
      setBody('')
      setPinned(false)
      onClose()
    } catch {
      showToast('Failed to post announcement', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        New Announcement
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <form id="announcement-form" onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={<Checkbox checked={pinned} onChange={(e) => setPinned(e.target.checked)} />}
            label="Pin this announcement"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          form="announcement-form"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          Post
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AnnouncementDialog
