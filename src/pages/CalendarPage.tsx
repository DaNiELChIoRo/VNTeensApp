import React, { useState, useRef } from 'react'
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import { format } from 'date-fns'
import CalendarView from '../components/calendar/CalendarView'
import CalendarSnapshotHeader from '../components/calendar/CalendarSnapshotHeader'
import EventLegend from '../components/calendar/EventLegend'
import EventDialog from '../components/events/EventDialog'
import RoleGuard from '../components/common/RoleGuard'
import { useEvents } from '../hooks/useEvents'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../contexts/NotificationContext'
import { captureElementAsSnapshot, downloadSnapshot, shareSnapshot } from '../utils/calendarSnapshot'

const CalendarPage: React.FC = () => {
  const { data: events } = useEvents()
  const { userRole } = useAuth()
  const { showToast } = useToast()
  const [createOpen, setCreateOpen] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const snapshotContainerRef = useRef<HTMLDivElement>(null)

  const handleSnapshot = async () => {
    setIsCapturing(true)
    try {
      const blob = await captureElementAsSnapshot(snapshotContainerRef.current!)
      const filename = `vnteens-calendar-${format(new Date(), 'yyyy-MM-dd')}.png`
      const shared = await shareSnapshot(blob, filename)
      if (!shared) downloadSnapshot(blob, filename)
      showToast(shared ? 'Calendar shared!' : 'Calendar saved as image', 'success')
    } catch {
      showToast('Failed to capture calendar', 'error')
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Calendar</Typography>
        <RoleGuard requiredRole="manager">
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={isCapturing ? <CircularProgress size={16} /> : <CameraAltIcon />}
              onClick={handleSnapshot}
              disabled={isCapturing}
            >
              {isCapturing ? 'Capturing…' : 'Snapshot'}
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
              New Event
            </Button>
          </Box>
        </RoleGuard>
      </Box>

      <EventLegend />

      <Paper sx={{ p: 2, mt: 1 }}>
        <CalendarView events={events} isManager={userRole === 'manager'} />
      </Paper>

      <EventDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      {/* Hidden off-screen container for snapshot capture */}
      <Box
        ref={snapshotContainerRef}
        sx={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '1024px',
          bgcolor: '#ffffff',
          overflow: 'visible',
          zIndex: -1,
        }}
      >
        <CalendarSnapshotHeader viewTitle={format(new Date(), 'MMMM yyyy')} />
        <Box sx={{ p: 2 }}>
          <CalendarView events={events} isManager={false} hideToolbar />
        </Box>
      </Box>
    </Box>
  )
}

export default CalendarPage
