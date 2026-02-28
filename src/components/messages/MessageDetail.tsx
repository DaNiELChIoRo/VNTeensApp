import React, { useEffect } from 'react'
import { Box, Typography, Divider, Chip, Paper, IconButton, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ReplyIcon from '@mui/icons-material/Reply'
import CampaignIcon from '@mui/icons-material/Campaign'
import { Message } from '../../types'
import { formatDateTime } from '../../utils/formatDate'
import { markMessageRead } from '../../services/messageService'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  message: Message
  onBack?: () => void
  onReply?: (message: Message) => void
}

const MessageDetail: React.FC<Props> = ({ message, onBack, onReply }) => {
  const { currentUser } = useAuth()
  const canReply = onReply && currentUser && message.senderId !== currentUser.uid

  useEffect(() => {
    if (currentUser && !message.readBy.includes(currentUser.uid)) {
      markMessageRead(message.id, currentUser.uid)
    }
  }, [message.id, currentUser])

  return (
    <Paper sx={{ p: 3, height: '100%' }} elevation={0} variant="outlined">
      {onBack && (
        <IconButton onClick={onBack} sx={{ mb: 1, ml: -1 }}>
          <ArrowBackIcon />
        </IconButton>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="h6" fontWeight={700} sx={{ flex: 1, minWidth: 0, mr: 1 }}>
          {message.subject}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
          {message.recipientId === 'broadcast' && (
            <Chip icon={<CampaignIcon />} label="Broadcast" size="small" color="secondary" />
          )}
          {canReply && (
            <Button size="small" variant="outlined" startIcon={<ReplyIcon />} onClick={() => onReply!(message)}>
              Reply
            </Button>
          )}
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary">
        From: <strong>{message.senderName}</strong>
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {formatDateTime(message.sentAt)}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
        {message.body}
      </Typography>
    </Paper>
  )
}

export default MessageDetail
