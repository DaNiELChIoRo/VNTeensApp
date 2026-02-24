import React from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EventForm, { EventFormData } from './EventForm'
import { AppEvent } from '../../types'
import { createEvent, updateEvent } from '../../services/eventService'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../contexts/NotificationContext'

interface Props {
  open: boolean
  onClose: () => void
  event?: AppEvent
  defaultStart?: Date
}

const EventDialog: React.FC<Props> = ({ open, onClose, event, defaultStart }) => {
  const { currentUser } = useAuth()
  const { showToast } = useToast()

  const handleSubmit = async (data: EventFormData) => {
    const start = new Date(data.startDateTime)
    const end = new Date(data.endDateTime)
    try {
      if (event) {
        await updateEvent(event.id, {
          title: data.title,
          description: data.description,
          location: data.location,
          startDateTime: start as unknown as import('firebase/firestore').Timestamp,
          endDateTime: end as unknown as import('firebase/firestore').Timestamp,
          allDay: data.allDay,
          eventType: data.eventType,
          assignedUserIds: data.assignedUserIds,
        })
        showToast('Event updated', 'success')
      } else {
        await createEvent({
          title: data.title,
          description: data.description,
          location: data.location,
          startDateTime: start,
          endDateTime: end,
          allDay: data.allDay,
          eventType: data.eventType,
          assignedUserIds: data.assignedUserIds,
          createdBy: currentUser!.uid,
        })
        showToast('Event created', 'success')
      }
      onClose()
    } catch {
      showToast('Failed to save event', 'error')
    }
  }

  const getDefaultStart = () => {
    const d = defaultStart ?? new Date()
    return {
      startDateTime: { toDate: () => d } as import('firebase/firestore').Timestamp,
      endDateTime: { toDate: () => new Date(d.getTime() + 3600000) } as import('firebase/firestore').Timestamp,
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {event ? 'Edit Event' : 'New Event'}
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <EventForm
          initial={event ?? getDefaultStart()}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel={event ? 'Update' : 'Create'}
        />
      </DialogContent>
    </Dialog>
  )
}

export default EventDialog
