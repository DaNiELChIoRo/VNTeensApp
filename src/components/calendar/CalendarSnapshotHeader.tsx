import React from 'react'
import { Box, Typography, Chip } from '@mui/material'
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from '../../utils/eventColors'
import { EventType } from '../../types'

interface Props {
  viewTitle: string
}

const CalendarSnapshotHeader: React.FC<Props> = ({ viewTitle }) => {
  const eventTypes = Object.keys(EVENT_TYPE_COLORS) as EventType[]

  return (
    <Box
      sx={{
        bgcolor: '#3f51b5',
        px: 3,
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      <Box>
        <Typography variant="h5" fontWeight={700} color="#ffffff">
          VNTeens
        </Typography>
        <Typography variant="body2" color="rgba(255,255,255,0.8)">
          {viewTitle}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
        {eventTypes.map((type) => (
          <Chip
            key={type}
            label={EVENT_TYPE_LABELS[type]}
            size="small"
            sx={{
              bgcolor: EVENT_TYPE_COLORS[type],
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default CalendarSnapshotHeader
