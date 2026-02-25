import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  writeBatch,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firestore'
import { AppNotification } from '../types'

const COLLECTION = 'notifications'

export const createNotification = (data: Omit<AppNotification, 'id' | 'createdAt'>) =>
  addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  })

export const markNotificationRead = (id: string) =>
  updateDoc(doc(db, COLLECTION, id), { read: true })

export const markAllNotificationsRead = async (uid: string) => {
  // Client-side batch — for production use a Cloud Function
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', uid),
    where('read', '==', false)
  )
  const snap = await getDocs(q)
  const batch = writeBatch(db)
  snap.docs.forEach((d) => batch.update(d.ref, { read: true }))
  return batch.commit()
}

export const subscribeToNotifications = (uid: string, callback: (items: AppNotification[]) => void) => {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', uid),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppNotification))
    callback(items)
  })
}
