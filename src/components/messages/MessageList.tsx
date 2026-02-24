import React from 'react'
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
  Divider,
  Box,
} from '@mui/material'
import MailIcon from '@mui/icons-material/Mail'
import DraftsIcon from '@mui/icons-material/Drafts'
import CampaignIcon from '@mui/icons-material/Campaign'
import { Message } from '../../types'
import { formatRelative } from '../../utils/formatDate'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  messages: Message[]
  selectedId?: string
  onSelect: (msg: Message) => void
}

const MessageList: React.FC<Props> = ({ messages, selectedId, onSelect }) => {
  const { currentUser } = useAuth()

  return (
    <List disablePadding>
      {messages.map((msg, i) => {
        const isRead = currentUser ? msg.readBy.includes(currentUser.uid) : false
        const isBroadcast = msg.recipientId === 'broadcast'
        return (
          <React.Fragment key={msg.id}>
            {i > 0 && <Divider />}
            <ListItemButton
              selected={msg.id === selectedId}
              onClick={() => onSelect(msg)}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {isBroadcast ? (
                  <CampaignIcon color={isRead ? 'disabled' : 'primary'} />
                ) : isRead ? (
                  <DraftsIcon color="disabled" />
                ) : (
                  <MailIcon color="primary" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight={isRead ? 400 : 700} noWrap sx={{ maxWidth: 180 }}>
                      {msg.subject}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      {isBroadcast && <Chip label="Broadcast" size="small" sx={{ fontSize: '0.6rem' }} />}
                      {!isRead && <Chip label="New" size="small" color="primary" sx={{ fontSize: '0.6rem' }} />}
                    </Box>
                  </Box>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {formatRelative(msg.sentAt)}
                  </Typography>
                }
              />
            </ListItemButton>
          </React.Fragment>
        )
      })}
    </List>
  )
}

export default MessageList
