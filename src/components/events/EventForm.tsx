import React, { useEffect, useState } from 'react'
import {
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  CircularProgress,
  Autocomplete,
  Chip,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AppEvent, AppUser, EventType } from '../../types'
import { EVENT_TYPE_COLORS } from '../../utils/eventColors'
import { getAllUsers } from '../../services/userService'

interface Props {
  initial?: Partial<AppEvent>
  onSubmit: (data: EventFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export interface EventFormData {
  title: string
  description: string
  location: string
  startDateTime: string
  endDateTime: string
  allDay: boolean
  eventType: EventType
  assignedUserIds: string[]
}

const EVENT_TYPES = Object.keys(EVENT_TYPE_COLORS) as EventType[]

const toInputDate = (d: Date) => d.toISOString().slice(0, 16)

const EventForm: React.FC<Props> = ({ initial, onSubmit, onCancel, submitLabel }) => {
  const { t } = useTranslation()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [location, setLocation] = useState(initial?.location ?? '')
  const [startDateTime, setStartDateTime] = useState(
    initial?.startDateTime ? toInputDate(initial.startDateTime.toDate()) : toInputDate(new Date())
  )
  const [endDateTime, setEndDateTime] = useState(
    initial?.endDateTime
      ? toInputDate(initial.endDateTime.toDate())
      : toInputDate(new Date(Date.now() + 3600000))
  )

  const handleStartChange = (value: string) => {
    setStartDateTime(value)
    const newStart = new Date(value)
    const currentEnd = new Date(endDateTime)
    if (currentEnd <= newStart) {
      setEndDateTime(toInputDate(new Date(newStart.getTime() + 3600000)))
    }
  }

  const handleStartDateOnlyChange = (value: string) => {
    setStartDateTime(value)
    if (endDateTime.slice(0, 10) < value) {
      setEndDateTime(value)
    }
  }

  const [allDay, setAllDay] = useState(initial?.allDay ?? false)
  const [eventType, setEventType] = useState<EventType>(initial?.eventType ?? 'other')
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>(initial?.assignedUserIds ?? [])
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllUsers().then(setUsers)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({ title, description, location, startDateTime, endDateTime, allDay, eventType, assignedUserIds })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
      <TextField label={t('events.title')} value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
      <TextField
        label={t('events.type')}
        select
        value={eventType}
        onChange={(e) => setEventType(e.target.value as EventType)}
        fullWidth
      >
        {EVENT_TYPES.map((type) => (
          <MenuItem key={type} value={type}>{t(`events.types.${type}`)}</MenuItem>
        ))}
      </TextField>
      <TextField label={t('events.description')} value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={2} fullWidth />
      <TextField label={t('events.location')} value={location} onChange={(e) => setLocation(e.target.value)} fullWidth />
      <FormControlLabel
        control={<Checkbox checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />}
        label={t('events.allDay')}
      />
      <TextField
        label={t('events.start')}
        type={allDay ? 'date' : 'datetime-local'}
        value={allDay ? startDateTime.slice(0, 10) : startDateTime}
        onChange={(e) => allDay ? handleStartDateOnlyChange(e.target.value) : handleStartChange(e.target.value)}
        required
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label={t('events.end')}
        type={allDay ? 'date' : 'datetime-local'}
        value={allDay ? endDateTime.slice(0, 10) : endDateTime}
        onChange={(e) => setEndDateTime(e.target.value)}
        inputProps={{ min: allDay ? startDateTime.slice(0, 10) : startDateTime }}
        required
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <Autocomplete
        multiple
        options={users}
        getOptionLabel={(u) => u.displayName || u.email}
        value={users.filter((u) => assignedUserIds.includes(u.uid))}
        onChange={(_, selected) => setAssignedUserIds(selected.map((u) => u.uid))}
        renderTags={(value, getTagProps) =>
          value.map((u, index) => {
            const { key, ...tagProps } = getTagProps({ index })
            return <Chip key={key} label={u.displayName || u.email} size="small" {...tagProps} />
          })
        }
        renderInput={(params) => <TextField {...params} label={t('events.assignPeople')} />}
      />
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>{t('common.cancel')}</Button>
        <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : null}>
          {submitLabel ?? t('common.save')}
        </Button>
      </Box>
    </Box>
  )
}

export default EventForm
