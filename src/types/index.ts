import { Timestamp } from 'firebase/firestore'

export type UserRole = 'manager' | 'user'

export interface AppUser {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
  role: UserRole
  fcmTokens?: string[]
  createdAt: Timestamp
}

export type EventType =
  | 'worship'
  | 'outreach'
  | 'meeting'
  | 'social'
  | 'service'
  | 'training'
  | 'other'

export interface AppEvent {
  id: string
  title: string
  description: string
  location: string
  startDateTime: Timestamp
  endDateTime: Timestamp
  allDay: boolean
  eventType: EventType
  color: string
  assignedUserIds: string[]
  createdBy: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  authorId: string
  createdAt: Timestamp
  readBy: string[]
  pinned: boolean
}

export interface Message {
  id: string
  senderId: string
  recipientId: string // 'broadcast' or uid
  subject: string
  body: string
  sentAt: Timestamp
  readBy: string[]
}

export interface AppNotification {
  id: string
  userId: string
  title: string
  body: string
  type: 'event' | 'announcement' | 'message' | 'system'
  referenceId: string
  read: boolean
  createdAt: Timestamp
}

export interface FCMToken {
  token: string
  deviceInfo: string
  createdAt: Timestamp
}
