import React from 'react'
import { Box, Typography, Chip, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { EventType } from '../../types'
import { EVENT_TYPE_COLORS } from '../../utils/eventColors'

const EVENT_TYPES = Object.keys(EVENT_TYPE_COLORS) as EventType[]

const EventLegend: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom>
        {t('calendar.eventTypes')}
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 0.5 }}>
        {EVENT_TYPES.map((type) => (
          <Chip
            key={type}
            label={t(`events.types.${type}`)}
            size="small"
            sx={{ bgcolor: EVENT_TYPE_COLORS[type], color: '#fff', fontSize: '0.65rem' }}
          />
        ))}
      </Stack>
    </Box>
  )
}

export default EventLegend
