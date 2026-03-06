import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'react-i18next'
import { createUserAccount } from '../../services/pushNotificationService'
import { useToast } from '../../contexts/NotificationContext'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const CreateUserDialog: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const { showToast } = useToast()
  const { t } = useTranslation()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'manager' | 'user'>('user')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setDisplayName('')
      setEmail('')
      setRole('user')
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createUserAccount({ displayName, email, role })
      showToast(t('users.userCreated', { email }), 'success')
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('users.failedToUpdateRole')
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {t('users.addNewUser')}
        <IconButton size="small" onClick={onClose} disabled={loading}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <form id="create-user-form" onSubmit={handleSubmit}>
          <TextField
            label={t('users.displayName')}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            fullWidth
            disabled={loading}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            label={t('users.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            disabled={loading}
            sx={{ mb: 2 }}
          />
          <TextField
            label={t('users.role')}
            value={role}
            onChange={(e) => setRole(e.target.value as 'manager' | 'user')}
            select
            fullWidth
            disabled={loading}
          >
            <MenuItem value="user">{t('users.user')}</MenuItem>
            <MenuItem value="manager">{t('users.manager')}</MenuItem>
          </TextField>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>{t('common.cancel')}</Button>
        <Button
          type="submit"
          form="create-user-form"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? t('users.creating') : t('users.createUser')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateUserDialog
