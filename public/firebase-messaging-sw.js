// firebase-messaging-sw.js
// This service worker handles background FCM push notifications.
// It must live at the root of your domain (public/).

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js')

// These values are safe to include in the SW since they are public API keys.
// They are NOT secrets — Firebase security is enforced by Security Rules.
firebase.initializeApp({
  apiKey: self.__FIREBASE_API_KEY__ || 'REPLACE_WITH_YOUR_API_KEY',
  authDomain: self.__FIREBASE_AUTH_DOMAIN__ || 'REPLACE.firebaseapp.com',
  projectId: self.__FIREBASE_PROJECT_ID__ || 'REPLACE',
  storageBucket: self.__FIREBASE_STORAGE_BUCKET__ || 'REPLACE.appspot.com',
  messagingSenderId: self.__FIREBASE_MESSAGING_SENDER_ID__ || 'REPLACE',
  appId: self.__FIREBASE_APP_ID__ || 'REPLACE',
})

const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received:', payload)

  const { title = 'VNTeens', body = '' } = payload.notification ?? {}

  self.registration.showNotification(title, {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: payload.data,
  })
})

// Handle notification click — open or focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})
