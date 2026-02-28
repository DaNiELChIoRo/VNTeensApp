import * as admin from 'firebase-admin'
import { onCall, HttpsError } from 'firebase-functions/v2/https'

admin.initializeApp()

const ALLOWED_UID = 'gma2CqZqiCWJuCQMIVmeGEfcBXV2'

interface SendPushData {
  title: string
  body: string
}

export const sendTestPushNotification = onCall(
  { region: 'us-central1' },
  async (request) => {
    // Must be authenticated
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in.')
    }

    // Must be the specific allowed UID
    if (request.auth.uid !== ALLOWED_UID) {
      throw new HttpsError('permission-denied', 'Not authorised to send push notifications.')
    }

    // Must have manager role
    const userDoc = await admin.firestore().collection('users').doc(request.auth.uid).get()
    if (userDoc.data()?.role !== 'manager') {
      throw new HttpsError('permission-denied', 'Manager role required.')
    }

    const { title, body } = request.data as SendPushData
    if (!title?.trim() || !body?.trim()) {
      throw new HttpsError('invalid-argument', 'title and body are required.')
    }

    // Collect all registered FCM tokens for this user
    const tokensSnap = await admin
      .firestore()
      .collection('users')
      .doc(request.auth.uid)
      .collection('fcmTokens')
      .get()

    const tokens = tokensSnap.docs.map((d) => d.id)

    if (tokens.length === 0) {
      throw new HttpsError('not-found', 'No registered devices found. Open the app on a device first to register a token.')
    }

    // Send to all registered devices
    const result = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: { title, body },
      webpush: {
        notification: {
          title,
          body,
          icon: '/VNTeensApp/icons/icon-192x192.png',
          badge: '/VNTeensApp/icons/icon-96x96.png',
        },
        fcmOptions: {
          link: '/VNTeensApp/',
        },
      },
    })

    // Remove tokens that are no longer valid
    const invalidTokenDeletions = result.responses
      .map((r, i) => (r.success ? null : tokens[i]))
      .filter((t): t is string => t !== null)
      .map((token) =>
        admin
          .firestore()
          .collection('users')
          .doc(request.auth!.uid)
          .collection('fcmTokens')
          .doc(token)
          .delete()
      )
    await Promise.all(invalidTokenDeletions)

    return {
      successCount: result.successCount,
      failureCount: result.failureCount,
      tokenCount: tokens.length,
    }
  }
)
