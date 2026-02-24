import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import NotificationCenter from '../components/notifications/NotificationCenter'

const NotificationsPage: React.FC = () => (
  <Box>
    <Typography variant="h5" fontWeight={700} gutterBottom>
      Notifications
    </Typography>
    <Paper sx={{ p: 2 }}>
      <NotificationCenter />
    </Paper>
  </Box>
)

export default NotificationsPage
