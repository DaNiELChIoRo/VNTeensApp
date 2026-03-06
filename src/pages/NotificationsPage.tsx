import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { useTranslation } from 'react-i18next'
import NotificationCenter from '../components/notifications/NotificationCenter'

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {t('notifications.title')}
      </Typography>
      <Paper sx={{ p: 2 }}>
        <NotificationCenter />
      </Paper>
    </Box>
  )
}

export default NotificationsPage
