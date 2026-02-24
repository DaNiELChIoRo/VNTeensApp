import { getMessaging, getToken, onMessage, MessagePayload } from 'firebase/messaging'
import { app } from './config'

export const messaging = getMessaging(app)

export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.getRegistration(
        '/firebase-messaging-sw.js'
      ),
    })
    return token || null
  } catch (err) {
    console.error('FCM token error:', err)
    return null
  }
}

export const onForegroundMessage = (callback: (payload: MessagePayload) => void) =>
  onMessage(messaging, callback)
