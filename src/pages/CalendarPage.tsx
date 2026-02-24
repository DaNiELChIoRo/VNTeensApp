import React, { useState } from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CalendarView from '../components/calendar/CalendarView'
import EventLegend from '../components/calendar/EventLegend'
import EventDialog from '../components/events/EventDialog'
import RoleGuard from '../components/common/RoleGuard'
import { useEvents } from '../hooks/useEvents'
import { useAuth } from '../hooks/useAuth'

const CalendarPage: React.FC = () => {
  const { data: events } = useEvents()
  const { userRole } = useAuth()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Calendar</Typography>
        <RoleGuard requiredRole="manager">
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            New Event
          </Button>
        </RoleGuard>
      </Box>

      <EventLegend />

      <Paper sx={{ p: 2, mt: 1 }}>
        <CalendarView events={events} isManager={userRole === 'manager'} />
      </Paper>

      <EventDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  )
}

export default CalendarPage
