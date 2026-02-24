import React from 'react'
import { Chip } from '@mui/material'
import { EventType } from '../../types'
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from '../../utils/eventColors'

interface Props {
  eventType: EventType
  size?: 'small' | 'medium'
}

const EventTypeChip: React.FC<Props> = ({ eventType, size = 'small' }) => (
  <Chip
    label={EVENT_TYPE_LABELS[eventType]}
    size={size}
    sx={{
      bgcolor: EVENT_TYPE_COLORS[eventType],
      color: '#fff',
      fontWeight: 600,
      fontSize: '0.7rem',
    }}
  />
)

export default EventTypeChip
