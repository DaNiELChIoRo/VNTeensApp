import React, { useState } from 'react'
import { IconButton, Badge } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../../hooks/useNotifications'

const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()

  return (
    <IconButton onClick={() => navigate('/notifications')}>
      <Badge badgeContent={unreadCount > 0 ? unreadCount : undefined} color="error" max={99}>
        <NotificationsIcon />
      </Badge>
    </IconButton>
  )
}

export default NotificationBell
