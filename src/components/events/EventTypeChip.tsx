import React from 'react'
import { Chip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { EventType } from '../../types'
import { EVENT_TYPE_COLORS } from '../../utils/eventColors'

interface Props {
  eventType: EventType
  size?: 'small' | 'medium'
}

const EventTypeChip: React.FC<Props> = ({ eventType, size = 'small' }) => {
  const { t } = useTranslation()

  return (
    <Chip
      label={t(`events.types.${eventType}`)}
      size={size}
      sx={{
        bgcolor: EVENT_TYPE_COLORS[eventType],
        color: '#fff',
        fontWeight: 600,
        fontSize: '0.7rem',
      }}
    />
  )
}

export default EventTypeChip
