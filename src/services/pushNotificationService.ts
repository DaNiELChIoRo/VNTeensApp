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
