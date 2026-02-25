import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firestore'
import { AppUser, UserRole } from '../types'

const COLLECTION = 'users'

export const createUserDoc = async (uid: string, data: {
  displayName: string
  email: string
  photoURL?: string | null
}) => {
  const ref = doc(db, COLLECTION, uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      ...data,
      photoURL: data.photoURL ?? null,
      role: 'user' as UserRole,
      fcmTokens: [],
      createdAt: serverTimestamp(),
    })
  }
}

export const getUserDoc = async (uid: string): Promise<AppUser | null> => {
  const snap = await getDoc(doc(db, COLLECTION, uid))
  return snap.exists() ? ({ uid: snap.id, ...snap.data() } as AppUser) : null
}

export const updateUserRole = (uid: string, role: UserRole) =>
  updateDoc(doc(db, COLLECTION, uid), { role })

export const updateUserProfile = (uid: string, data: Partial<Pick<AppUser, 'displayName' | 'photoURL'>>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateDoc(doc(db, COLLECTION, uid), data as Record<string, any>)

export const registerFCMToken = async (uid: string, token: string) => {
  const tokenRef = doc(db, COLLECTION, uid, 'fcmTokens', token)
  await setDoc(tokenRef, {
    token,
    deviceInfo: navigator.userAgent,
    createdAt: Timestamp.now(),
  })
}

export const getAllUsers = async (): Promise<AppUser[]> => {
  const q = query(collection(db, COLLECTION), orderBy('displayName'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as AppUser))
}

export const subscribeToAllUsers = (callback: (users: AppUser[]) => void) => {
  const q = query(collection(db, COLLECTION), orderBy('displayName'))
  return onSnapshot(q, (snap) => {
    const users = snap.docs.map((d) => ({ uid: d.id, ...d.data() } as AppUser))
    callback(users)
  })
}
