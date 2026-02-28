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
import { useQuery } from '@tanstack/react-query'
import { getAllUsers } from '../services/userService'
import { sendTestPushNotification } from '../services/pushNotificationService'
import UserTable from '../components/users/UserTable'
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

  const { currentUser } = useAuth()
  const { showToast } = useToast()
  const [pushTitle, setPushTitle] = useState('')
  const [pushBody, setPushBody] = useState('')
  const [isSending, setIsSending] = useState(false)

  const canSendPush = currentUser?.uid === PUSH_TEST_UID

  const handleSendPush = async () => {
    if (!pushTitle.trim() || !pushBody.trim()) {
      showToast('Title and body are required', 'warning')
      return
    }
    setIsSending(true)
    try {
      const result = await sendTestPushNotification({ title: pushTitle, body: pushBody })
      showToast(
        `Sent to ${result.successCount}/${result.tokenCount} device(s)`,
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
      <Typography variant="h5" fontWeight={700} gutterBottom>
        User Management
      </Typography>
      {isLoading ? <LoadingSpinner /> : <UserTable users={users} />}

      {canSendPush && (
        <>
          <Divider sx={{ my: 4 }} />
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <NotificationsActiveIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Push Notification Test
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Sends a push notification to all your registered devices. Only visible to you.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Title"
                value={pushTitle}
                onChange={(e) => setPushTitle(e.target.value)}
                size="small"
                disabled={isSending}
                fullWidth
              />
              <TextField
                label="Body"
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
                  {isSending ? 'Sending…' : 'Send to My Devices'}
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
