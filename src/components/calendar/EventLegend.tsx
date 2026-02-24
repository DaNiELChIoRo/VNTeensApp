import React from 'react'
import { Box, Typography, Chip, Stack } from '@mui/material'
import { EventType } from '../../types'
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from '../../utils/eventColors'

const EventLegend: React.FC = () => (
  <Box sx={{ py: 1 }}>
    <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom>
      EVENT TYPES
    </Typography>
    <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 0.5 }}>
      {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((type) => (
        <Chip
          key={type}
          label={EVENT_TYPE_LABELS[type]}
          size="small"
          sx={{ bgcolor: EVENT_TYPE_COLORS[type], color: '#fff', fontSize: '0.65rem' }}
        />
      ))}
    </Stack>
  </Box>
)

export default EventLegend
