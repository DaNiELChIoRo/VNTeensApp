import React from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material'
import PushPinIcon from '@mui/icons-material/PushPin'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Announcement } from '../../types'
import { formatRelative } from '../../utils/formatDate'
import { markAnnouncementRead } from '../../services/announcementService'
import { useAuth } from '../../hooks/useAuth'
import RoleGuard from '../common/RoleGuard'

interface Props {
  announcement: Announcement
  onDelete?: (id: string) => void
}

const AnnouncementCard: React.FC<Props> = ({ announcement, onDelete }) => {
  const { currentUser } = useAuth()
  const isRead = currentUser ? announcement.readBy.includes(currentUser.uid) : false

  const handleMarkRead = () => {
    if (currentUser && !isRead) {
      markAnnouncementRead(announcement.id, currentUser.uid)
    }
  }

  return (
    <Card
      sx={{
        mb: 2,
        border: announcement.pinned ? '2px solid' : '1px solid transparent',
        borderColor: announcement.pinned ? 'secondary.main' : 'transparent',
        opacity: isRead ? 0.8 : 1,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {announcement.pinned && (
              <PushPinIcon sx={{ fontSize: 16, color: 'secondary.main', transform: 'rotate(45deg)' }} />
            )}
            <Typography variant="h6" fontWeight={700}>
              {announcement.title}
            </Typography>
            {!isRead && <Chip label="New" size="small" color="primary" />}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formatRelative(announcement.createdAt)}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
          {announcement.body}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {!isRead && (
          <Tooltip title="Mark as read">
            <IconButton size="small" onClick={handleMarkRead}>
              <CheckCircleIcon fontSize="small" color="action" />
            </IconButton>
          </Tooltip>
        )}
        <RoleGuard requiredRole="manager">
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete?.(announcement.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </RoleGuard>
      </CardActions>
    </Card>
  )
}

export default AnnouncementCard
