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
import { AppEvent, AppUser, EventType } from '../../types'
import { EVENT_TYPE_LABELS } from '../../utils/eventColors'
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

const toInputDate = (d: Date) => d.toISOString().slice(0, 16)

const EventForm: React.FC<Props> = ({ initial, onSubmit, onCancel, submitLabel = 'Save' }) => {
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
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
      <TextField
        label="Event Type"
        select
        value={eventType}
        onChange={(e) => setEventType(e.target.value as EventType)}
        fullWidth
      >
        {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((t) => (
          <MenuItem key={t} value={t}>{EVENT_TYPE_LABELS[t]}</MenuItem>
        ))}
      </TextField>
      <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={2} fullWidth />
      <TextField label="Location" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth />
      <FormControlLabel
        control={<Checkbox checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />}
        label="All day"
      />
      <TextField
        label="Start"
        type={allDay ? 'date' : 'datetime-local'}
        value={allDay ? startDateTime.slice(0, 10) : startDateTime}
        onChange={(e) => setStartDateTime(e.target.value)}
        required
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="End"
        type={allDay ? 'date' : 'datetime-local'}
        value={allDay ? endDateTime.slice(0, 10) : endDateTime}
        onChange={(e) => setEndDateTime(e.target.value)}
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
          value.map((u, index) => (
            <Chip key={u.uid} label={u.displayName || u.email} size="small" {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => <TextField {...params} label="Assign People" />}
      />
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={16} /> : null}>
          {submitLabel}
        </Button>
      </Box>
    </Box>
  )
}

export default EventForm
