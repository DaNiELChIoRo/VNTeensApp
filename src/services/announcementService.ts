import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firestore'
import { Announcement } from '../types'

const COLLECTION = 'announcements'

export const createAnnouncement = (data: {
  title: string
  body: string
  authorId: string
  pinned?: boolean
}) =>
  addDoc(collection(db, COLLECTION), {
    ...data,
    pinned: data.pinned ?? false,
    readBy: [],
    createdAt: serverTimestamp(),
  })

export const updateAnnouncement = (id: string, data: Partial<Announcement>) =>
  updateDoc(doc(db, COLLECTION, id), data as Record<string, unknown>)

export const deleteAnnouncement = (id: string) => deleteDoc(doc(db, COLLECTION, id))

export const markAnnouncementRead = (id: string, uid: string) =>
  updateDoc(doc(db, COLLECTION, id), { readBy: arrayUnion(uid) })

export const subscribeToAnnouncements = (callback: (items: Announcement[]) => void) => {
  const q = query(collection(db, COLLECTION), orderBy('pinned', 'desc'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement))
    callback(items)
  })
}
