import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'react-i18next'
import { sendMessage } from '../../services/messageService'
import { getAllUsers } from '../../services/userService'
import { AppUser } from '../../types'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/NotificationContext'

interface Props {
  open: boolean
  onClose: () => void
  defaultRecipient?: string
  defaultSubject?: string
}

const ComposeDialog: React.FC<Props> = ({ open, onClose, defaultRecipient = 'broadcast', defaultSubject = '' }) => {
  const { currentUser } = useAuth()
  const { showToast } = useToast()
  const { t } = useTranslation()
  const [recipient, setRecipient] = useState(defaultRecipient)
  const [subject, setSubject] = useState(defaultSubject)
  const [body, setBody] = useState('')
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      getAllUsers().then(setUsers)
      setRecipient(defaultRecipient)
      setSubject(defaultSubject)
      setBody('')
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    setLoading(true)
    try {
      await sendMessage({
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email || 'Unknown',
        recipientId: recipient,
        subject,
        body,
      })
      showToast(t('messages.sent'), 'success')
      setSubject('')
      setBody('')
      setRecipient(defaultRecipient)
      onClose()
    } catch {
      showToast(t('messages.failedToSend'), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {defaultSubject ? t('messages.replyTitle') : t('messages.composeTitle')}
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <form id="compose-form" onSubmit={handleSubmit}>
          <TextField
            label={t('messages.to')}
            select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            fullWidth
            sx={{ mt: 1, mb: 2 }}
          >
            <MenuItem value="broadcast">{t('messages.everyone')}</MenuItem>
            {users
              .filter((u) => u.uid !== currentUser?.uid)
              .map((u) => (
                <MenuItem key={u.uid} value={u.uid}>
                  {u.displayName || u.email}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            label={t('messages.subject')}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label={t('messages.message')}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            fullWidth
            multiline
            rows={4}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button
          type="submit"
          form="compose-form"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {t('messages.send')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ComposeDialog
