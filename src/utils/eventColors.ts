import { EventType } from '../types'

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  worship: '#7c4dff',
  outreach: '#00bcd4',
  meeting: '#3f51b5',
  social: '#4caf50',
  service: '#ff9800',
  training: '#f44336',
  other: '#9e9e9e',
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  worship: 'Worship',
  outreach: 'Outreach',
  meeting: 'Meeting',
  social: 'Social',
  service: 'Service',
  training: 'Training',
  other: 'Other',
}

export const getEventColor = (eventType: EventType): string =>
  EVENT_TYPE_COLORS[eventType] ?? EVENT_TYPE_COLORS.other
