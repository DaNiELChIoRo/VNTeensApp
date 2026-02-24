import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  arrayUnion,
  serverTimestamp,
  or,
} from 'firebase/firestore'
import { db } from '../firebase/firestore'
import { Message } from '../types'

const COLLECTION = 'messages'

export const sendMessage = (data: {
  senderId: string
  recipientId: string
  subject: string
  body: string
}) =>
  addDoc(collection(db, COLLECTION), {
    ...data,
    readBy: [],
    sentAt: serverTimestamp(),
  })

export const markMessageRead = (id: string, uid: string) =>
  updateDoc(doc(db, COLLECTION, id), { readBy: arrayUnion(uid) })

export const subscribeToMessages = (uid: string, callback: (msgs: Message[]) => void) => {
  const q = query(
    collection(db, COLLECTION),
    or(
      where('recipientId', '==', uid),
      where('recipientId', '==', 'broadcast')
    ),
    orderBy('sentAt', 'desc')
  )
  return onSnapshot(q, (snap) => {
    const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message))
    callback(msgs)
  })
}

export const subscribeToAllMessages = (callback: (msgs: Message[]) => void) => {
  const q = query(collection(db, COLLECTION), orderBy('sentAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message))
    callback(msgs)
  })
}
