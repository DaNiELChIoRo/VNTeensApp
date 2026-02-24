import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { updateUserProfile } from '../services/userService'
import { updateProfile } from 'firebase/auth'
import { auth } from '../firebase/auth'
import { useToast } from '../contexts/NotificationContext'

const ProfilePage: React.FC = () => {
  const { currentUser, userRole } = useAuth()
  const { showToast } = useToast()
  const [displayName, setDisplayName] = useState(currentUser?.displayName ?? '')
  const [loading, setLoading] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    setLoading(true)
    try {
      await updateProfile(auth.currentUser!, { displayName })
      await updateUserProfile(currentUser.uid, { displayName })
      showToast('Profile updated', 'success')
    } catch {
      showToast('Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 480 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Profile
      </Typography>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar
              src={currentUser?.photoURL ?? undefined}
              sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 24 }}
            >
              {currentUser?.displayName?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>{currentUser?.displayName}</Typography>
              <Typography variant="body2" color="text.secondary">{currentUser?.email}</Typography>
              <Chip
                label={userRole}
                size="small"
                color={userRole === 'manager' ? 'secondary' : 'default'}
                sx={{ mt: 0.5, textTransform: 'capitalize' }}
              />
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box component="form" onSubmit={handleSave} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Email"
              value={currentUser?.email ?? ''}
              disabled
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            >
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ProfilePage
