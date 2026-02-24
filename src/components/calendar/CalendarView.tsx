import React, { useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { EventClickArg, DateSelectArg, EventDropArg } from '@fullcalendar/core'
import { Box, useTheme } from '@mui/material'
import { AppEvent } from '../../types'
import { updateEvent } from '../../services/eventService'
import { Timestamp } from 'firebase/firestore'
import EventPopover from './EventPopover'
import EventDialog from '../events/EventDialog'
import ConfirmDialog from '../common/ConfirmDialog'
import { deleteEvent } from '../../services/eventService'
import { useToast } from '../../contexts/NotificationContext'

interface Props {
  events: AppEvent[]
  isManager: boolean
}

const CalendarView: React.FC<Props> = ({ events, isManager }) => {
  const theme = useTheme()
  const { showToast } = useToast()

  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [defaultStart, setDefaultStart] = useState<Date | undefined>()

  const calendarEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.startDateTime.toDate(),
    end: e.endDateTime.toDate(),
    allDay: e.allDay,
    backgroundColor: e.color,
    borderColor: e.color,
    extendedProps: { event: e },
  }))

  const handleEventClick = (arg: EventClickArg) => {
    const appEvent = arg.event.extendedProps.event as AppEvent
    setSelectedEvent(appEvent)
    setPopoverAnchor(arg.el as HTMLElement)
  }

  const handleDateSelect = (arg: DateSelectArg) => {
    if (!isManager) return
    setDefaultStart(arg.start)
    setCreateDialogOpen(true)
  }

  const handleEventDrop = async (arg: EventDropArg) => {
    if (!isManager) { arg.revert(); return }
    const id = arg.event.id
    const start = arg.event.start!
    const end = arg.event.end ?? new Date(start.getTime() + 3600000)
    try {
      await updateEvent(id, {
        startDateTime: Timestamp.fromDate(start),
        endDateTime: Timestamp.fromDate(end),
      })
    } catch {
      arg.revert()
      showToast('Failed to update event', 'error')
    }
  }

  const handleDelete = async () => {
    if (!selectedEvent) return
    try {
      await deleteEvent(selectedEvent.id)
      showToast('Event deleted', 'success')
    } catch {
      showToast('Failed to delete event', 'error')
    } finally {
      setDeleteDialogOpen(false)
      setPopoverAnchor(null)
    }
  }

  return (
    <Box
      sx={{
        '& .fc': { fontFamily: theme.typography.fontFamily },
        '& .fc-button': { textTransform: 'none', borderRadius: '6px !important' },
        '& .fc-toolbar-title': { fontSize: '1.1rem', fontWeight: 700 },
        '& .fc-daygrid-event': { borderRadius: 4, px: 0.5 },
      }}
    >
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek',
        }}
        events={calendarEvents}
        selectable={isManager}
        editable={isManager}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        height="auto"
      />

      <EventPopover
        event={selectedEvent}
        anchorEl={popoverAnchor}
        onClose={() => { setPopoverAnchor(null); setSelectedEvent(null) }}
        onEdit={(ev) => { setEditDialogOpen(true); setPopoverAnchor(null) }}
        onDelete={(ev) => { setDeleteDialogOpen(true); setPopoverAnchor(null) }}
      />

      <EventDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        defaultStart={defaultStart}
      />

      {selectedEvent && (
        <EventDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          event={selectedEvent}
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Event"
        message={`Are you sure you want to delete "${selectedEvent?.title}"?`}
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  )
}

export default CalendarView
