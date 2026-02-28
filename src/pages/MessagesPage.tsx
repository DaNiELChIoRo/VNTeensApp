import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useMessages } from '../hooks/useMessages'
import MessageList from '../components/messages/MessageList'
import MessageDetail from '../components/messages/MessageDetail'
import ComposeDialog from '../components/messages/ComposeDialog'
import EmptyState from '../components/common/EmptyState'
import MailIcon from '@mui/icons-material/Mail'
import { Message } from '../types'
import RoleGuard from '../components/common/RoleGuard'

const MessagesPage: React.FC = () => {
  const { data: messages } = useMessages()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [selected, setSelected] = useState<Message | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [replyDefaults, setReplyDefaults] = useState<{ recipientId: string; subject: string } | null>(null)

  const handleReply = (message: Message) => {
    setReplyDefaults({
      recipientId: message.senderId,
      subject: message.subject.startsWith('Re: ') ? message.subject : `Re: ${message.subject}`,
    })
    setComposeOpen(true)
  }

  const handleCloseCompose = () => {
    setComposeOpen(false)
    setReplyDefaults(null)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Messages</Typography>
        <RoleGuard requiredRole="manager">
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setReplyDefaults(null); setComposeOpen(true) }}>
            Compose
          </Button>
        </RoleGuard>
      </Box>

      {messages.length === 0 ? (
        <EmptyState message="No messages yet" icon={MailIcon} />
      ) : (
        <Grid container spacing={2} sx={{ height: { md: 'calc(100vh - 160px)' } }}>
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{ display: isMobile && selected ? 'none' : 'block', overflow: 'auto' }}
          >
            <Paper elevation={0} variant="outlined" sx={{ height: '100%', overflow: 'auto' }}>
              <MessageList
                messages={messages}
                selectedId={selected?.id}
                onSelect={(msg) => setSelected(msg)}
              />
            </Paper>
          </Grid>
          <Grid
            size={{ xs: 12, md: 8 }}
            sx={{ display: isMobile && !selected ? 'none' : 'block' }}
          >
            {selected ? (
              <MessageDetail
                message={selected}
                onBack={isMobile ? () => setSelected(null) : undefined}
                onReply={handleReply}
              />
            ) : (
              <EmptyState message="Select a message to read" icon={MailIcon} />
            )}
          </Grid>
        </Grid>
      )}

      <ComposeDialog
        open={composeOpen}
        onClose={handleCloseCompose}
        defaultRecipient={replyDefaults?.recipientId}
        defaultSubject={replyDefaults?.subject}
      />
    </Box>
  )
}

export default MessagesPage
