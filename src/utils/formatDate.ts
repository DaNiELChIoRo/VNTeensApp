import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from 'date-fns'
import { Timestamp } from 'firebase/firestore'

export const toDate = (ts: Timestamp | Date | null | undefined): Date => {
  if (!ts) return new Date()
  if (ts instanceof Date) return ts
  return ts.toDate()
}

export const formatDateTime = (ts: Timestamp | Date): string =>
  format(toDate(ts), 'MMM d, yyyy h:mm a')

export const formatDate = (ts: Timestamp | Date): string =>
  format(toDate(ts), 'MMM d, yyyy')

export const formatTime = (ts: Timestamp | Date): string =>
  format(toDate(ts), 'h:mm a')

export const formatRelative = (ts: Timestamp | Date): string => {
  const date = toDate(ts)
  if (isToday(date)) return `Today at ${formatTime(date)}`
  if (isTomorrow(date)) return `Tomorrow at ${formatTime(date)}`
  if (isYesterday(date)) return `Yesterday at ${formatTime(date)}`
  return formatDistanceToNow(date, { addSuffix: true })
}

export const formatShort = (ts: Timestamp | Date): string =>
  format(toDate(ts), 'MMM d')
