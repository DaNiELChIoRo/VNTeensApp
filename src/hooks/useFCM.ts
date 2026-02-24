import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { requestNotificationPermission, onForegroundMessage } from '../firebase/messaging'
import { registerFCMToken } from '../services/userService'
import { useToast } from '../contexts/NotificationContext'

export const useFCM = () => {
  const { currentUser } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    if (!currentUser || !('Notification' in window)) return

    const init = async () => {
      try {
        const token = await requestNotificationPermission()
        if (token) {
          await registerFCMToken(currentUser.uid, token)
        }
      } catch (err) {
        console.error('FCM init error:', err)
      }
    }

    init()

    const unsub = onForegroundMessage((payload) => {
      const title = payload.notification?.title ?? 'New notification'
      const body = payload.notification?.body ?? ''
      showToast(`${title}: ${body}`, 'info')
    })

    return unsub
  }, [currentUser, showToast])
}
