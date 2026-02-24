import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import CircleIcon from '@mui/icons-material/Circle'
import { useNotifications } from '../../hooks/useNotifications'
import { markNotificationRead, markAllNotificationsRead } from '../../services/notificationService'
import { useAuth } from '../../hooks/useAuth'
import { formatRelative } from '../../utils/formatDate'
import EmptyState from '../common/EmptyState'
import NotificationsIcon from '@mui/icons-material/Notifications'

const NotificationCenter: React.FC = () => {
  const { data: notifications } = useNotifications()
  const { currentUser } = useAuth()

  const handleMarkRead = (id: string) => markNotificationRead(id)

  const handleMarkAll = () => {
    if (currentUser) markAllNotificationsRead(currentUser.uid)
  }

  if (notifications.length === 0) {
    return <EmptyState message="No notifications yet" icon={NotificationsIcon} />
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Tooltip title="Mark all as read">
          <IconButton size="small" onClick={handleMarkAll}>
            <DoneAllIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <List disablePadding>
        {notifications.map((n) => (
          <ListItem
            key={n.id}
            alignItems="flex-start"
            sx={{
              bgcolor: n.read ? 'transparent' : 'primary.50',
              borderRadius: 2,
              mb: 0.5,
              cursor: n.read ? 'default' : 'pointer',
            }}
            onClick={() => !n.read && handleMarkRead(n.id)}
            secondaryAction={
              !n.read && (
                <CircleIcon sx={{ fontSize: 10, color: 'primary.main', mt: 1.5 }} />
              )
            }
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body2" fontWeight={n.read ? 400 : 700}>
                    {n.title}
                  </Typography>
                  <Chip label={n.type} size="small" sx={{ textTransform: 'capitalize' }} />
                </Box>
              }
              secondary={
                <>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {n.body}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {formatRelative(n.createdAt)}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default NotificationCenter
