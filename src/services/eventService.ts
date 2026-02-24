import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firestore'
import { AppEvent, EventType } from '../types'
import { getEventColor } from '../utils/eventColors'

const COLLECTION = 'events'

export type CreateEventInput = {
  title: string
  description: string
  location: string
  startDateTime: Date
  endDateTime: Date
  allDay: boolean
  eventType: EventType
  assignedUserIds: string[]
  createdBy: string
}

export const createEvent = (input: CreateEventInput) =>
  addDoc(collection(db, COLLECTION), {
    ...input,
    color: getEventColor(input.eventType),
    startDateTime: Timestamp.fromDate(input.startDateTime),
    endDateTime: Timestamp.fromDate(input.endDateTime),
    createdAt: serverTimestamp(),
  })

export const updateEvent = (id: string, data: Partial<Omit<AppEvent, 'id'>>) => {
  const payload: Record<string, unknown> = { ...data }
  if (data.startDateTime instanceof Date) {
    payload.startDateTime = Timestamp.fromDate(data.startDateTime as unknown as Date)
  }
  if (data.endDateTime instanceof Date) {
    payload.endDateTime = Timestamp.fromDate(data.endDateTime as unknown as Date)
  }
  if (data.eventType) {
    payload.color = getEventColor(data.eventType)
  }
  return updateDoc(doc(db, COLLECTION, id), payload)
}

export const deleteEvent = (id: string) => deleteDoc(doc(db, COLLECTION, id))

export const subscribeToAllEvents = (callback: (events: AppEvent[]) => void) => {
  const q = query(collection(db, COLLECTION), orderBy('startDateTime', 'asc'))
  return onSnapshot(q, (snap) => {
    const events = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppEvent))
    callback(events)
  })
}

export const subscribeToUserEvents = (uid: string, callback: (events: AppEvent[]) => void) => {
  const q = query(
    collection(db, COLLECTION),
    where('assignedUserIds', 'array-contains', uid),
    orderBy('startDateTime', 'asc')
  )
  return onSnapshot(q, (snap) => {
    const events = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppEvent))
    callback(events)
  })
}
