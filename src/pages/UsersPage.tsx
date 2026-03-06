import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getAllUsers } from '../services/userService'
import { sendTestPushNotification } from '../services/pushNotificationService'
import UserTable from '../components/users/UserTable'
import CreateUserDialog from '../components/users/CreateUserDialog'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../contexts/NotificationContext'

const PUSH_TEST_UID = 'gma2CqZqiCWJuCQMIVmeGEfcBXV2'

const UsersPage: React.FC = () => {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    staleTime: 30000,
  })

  const queryClient = useQueryClient()
  const { currentUser } = useAuth()
  const { showToast } = useToast()
  const { t } = useTranslation()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [pushTitle, setPushTitle] = useState('')
  const [pushBody, setPushBody] = useState('')
  const [isSending, setIsSending] = useState(false)

  const canSendPush = currentUser?.uid === PUSH_TEST_UID

  const handleSendPush = async () => {
    if (!pushTitle.trim() || !pushBody.trim()) {
      showToast(t('pushTest.titleBodyRequired'), 'warning')
      return
    }
    setIsSending(true)
    try {
      const result = await sendTestPushNotification({ title: pushTitle, body: pushBody })
      showToast(
        t('pushTest.sentToDevices', { success: result.successCount, total: result.tokenCount }),
        result.failureCount > 0 ? 'warning' : 'success'
      )
      setPushTitle('')
      setPushBody('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send notification'
      showToast(message, 'error')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h5" fontWeight={700}>
          {t('users.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          {t('users.addUser')}
        </Button>
      </Box>
      {isLoading ? <LoadingSpinner /> : <UserTable users={users} />}
      <CreateUserDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
      />

      {canSendPush && (
        <>
          <Divider sx={{ my: 4 }} />
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <NotificationsActiveIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                {t('pushTest.title')}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('pushTest.description')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label={t('pushTest.titleField')}
                value={pushTitle}
                onChange={(e) => setPushTitle(e.target.value)}
                size="small"
                disabled={isSending}
                fullWidth
              />
              <TextField
                label={t('pushTest.bodyField')}
                value={pushBody}
                onChange={(e) => setPushBody(e.target.value)}
                size="small"
                disabled={isSending}
                multiline
                rows={2}
                fullWidth
              />
              <Box>
                <Button
                  variant="contained"
                  onClick={handleSendPush}
                  disabled={isSending || !pushTitle.trim() || !pushBody.trim()}
                  startIcon={isSending ? <CircularProgress size={16} color="inherit" /> : <NotificationsActiveIcon />}
                >
                  {isSending ? t('pushTest.sending') : t('pushTest.sendToMyDevices')}
                </Button>
              </Box>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  )
}

export default UsersPage
