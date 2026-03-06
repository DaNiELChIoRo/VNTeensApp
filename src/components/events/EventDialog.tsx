import React from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Timestamp } from 'firebase/firestore'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  const handleSubmit = async (data: EventFormData) => {
    const start = new Date(data.startDateTime)
    const end = new Date(data.endDateTime)
    try {
      if (event) {
        await updateEvent(event.id, {
          title: data.title,
          description: data.description,
          location: data.location,
          startDateTime: Timestamp.fromDate(start),
          endDateTime: Timestamp.fromDate(end),
          allDay: data.allDay,
          eventType: data.eventType,
          assignedUserIds: data.assignedUserIds,
        })
        showToast(t('events.updated'), 'success')
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
        showToast(t('events.created'), 'success')
      }
      onClose()
    } catch {
      showToast(t('events.failedToSave'), 'error')
    }
  }

  const getDefaultStart = () => {
    const d = defaultStart ?? new Date()
    return {
      startDateTime: Timestamp.fromDate(d),
      endDateTime: Timestamp.fromDate(new Date(d.getTime() + 3600000)),
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {event ? t('events.editEvent') : t('events.newEvent')}
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <EventForm
          initial={event ?? getDefaultStart()}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel={event ? t('events.update') : t('events.create')}
        />
      </DialogContent>
    </Dialog>
  )
}

export default EventDialog
