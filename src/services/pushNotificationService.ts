import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from '../firebase/config'

const functions = getFunctions(app, 'us-central1')

interface SendPushPayload {
  title: string
  body: string
}

interface SendPushResult {
  successCount: number
  failureCount: number
  tokenCount: number
}

export const sendTestPushNotification = (payload: SendPushPayload): Promise<SendPushResult> => {
  const fn = httpsCallable<SendPushPayload, SendPushResult>(functions, 'sendTestPushNotification')
  return fn(payload).then((r) => r.data)
}

interface CreateUserPayload {
  email: string
  displayName: string
  role: 'manager' | 'user'
}

export const createUserAccount = (data: CreateUserPayload): Promise<{ uid: string }> => {
  const fn = httpsCallable<CreateUserPayload, { uid: string }>(functions, 'createUserAccount')
  return fn(data).then((r) => r.data)
}
