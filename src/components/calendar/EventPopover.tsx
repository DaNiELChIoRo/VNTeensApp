import React from 'react'
import {
  Popover,
  Box,
  Typography,
  Chip,
  Divider,
  Button,
  Stack,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { AppEvent } from '../../types'
import { formatDateTime } from '../../utils/formatDate'
import EventTypeChip from '../events/EventTypeChip'
import RoleGuard from '../common/RoleGuard'

interface Props {
  event: AppEvent | null
  anchorEl: HTMLElement | null
  onClose: () => void
  onEdit: (event: AppEvent) => void
  onDelete: (event: AppEvent) => void
}

const EventPopover: React.FC<Props> = ({ event, anchorEl, onClose, onEdit, onDelete }) => {
  if (!event) return null

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{ sx: { p: 2, maxWidth: 320, borderRadius: 2 } }}
    >
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <EventTypeChip eventType={event.eventType} />
          {event.allDay && <Chip label="All day" size="small" variant="outlined" />}
        </Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {event.title}
        </Typography>
        {event.description && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {event.description}
          </Typography>
        )}
        <Divider sx={{ my: 1 }} />
        <Stack spacing={0.5}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="caption">
              {event.allDay
                ? formatDateTime(event.startDateTime).split(' ').slice(0, 3).join(' ')
                : `${formatDateTime(event.startDateTime)} – ${formatDateTime(event.endDateTime)}`}
            </Typography>
          </Box>
          {event.location && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <LocationOnIcon fontSize="small" color="action" />
              <Typography variant="caption">{event.location}</Typography>
            </Box>
          )}
        </Stack>
        <RoleGuard requiredRole="manager">
          <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
            <Button size="small" onClick={() => onEdit(event)}>Edit</Button>
            <Button size="small" color="error" onClick={() => onDelete(event)}>Delete</Button>
          </Box>
        </RoleGuard>
      </Box>
    </Popover>
  )
}

export default EventPopover
