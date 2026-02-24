import React from 'react'
import { Box, Typography, SvgIconProps } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'

interface Props {
  message: string
  icon?: React.ComponentType<SvgIconProps>
}

const EmptyState: React.FC<Props> = ({ message, icon: Icon = InboxIcon }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      gap: 2,
      color: 'text.disabled',
    }}
  >
    <Icon sx={{ fontSize: 64 }} />
    <Typography variant="body1">{message}</Typography>
  </Box>
)

export default EmptyState
