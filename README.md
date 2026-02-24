# VNTeens App

A production-ready Progressive Web App (PWA) for youth group management. Managers can schedule events, post announcements, and send messages, while members can view their schedules and receive real-time push notifications.

**Live:** https://danielchioro.github.io/VNTeensApp/

---

## Features

### For Everyone
- Email + Google OAuth sign-in
- Personal calendar view (only shows your assigned events)
- Announcement feed with read/unread tracking
- Inbox for direct and broadcast messages
- In-app and push notification center
- Installable PWA — works offline with cached data

### For Managers
- Create, edit, delete, and drag-and-drop events on the calendar
- Assign specific members to events
- Post and pin announcements
- Compose messages to individuals or broadcast to everyone
- User management table — assign/revoke manager role

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vite + React 18 + TypeScript |
| UI | Material UI (MUI v7) |
| Calendar | FullCalendar v6 |
| Routing | React Router v6 |
| Server state | TanStack React Query v5 |
| Backend | Firebase (Auth, Firestore, FCM, Storage) |
| PWA | vite-plugin-pwa + Workbox |
| Deploy | GitHub Pages via GitHub Actions |

---

## Project Structure

```
src/
├── firebase/         # Firebase service wrappers (auth, firestore, messaging, storage)
├── types/            # TypeScript interfaces for all Firestore entities
├── contexts/         # AuthContext, NotificationContext (toast)
├── hooks/            # useEvents, useAnnouncements, useMessages, useNotifications, useFCM
├── services/         # Firestore CRUD + real-time subscription functions
├── components/
│   ├── layout/       # AppShell, TopBar, SideNav, BottomNav
│   ├── auth/         # LoginForm, GoogleSignInButton
│   ├── calendar/     # CalendarView, EventPopover, EventLegend
│   ├── events/       # EventDialog, EventForm, EventTypeChip
│   ├── announcements/# AnnouncementCard, AnnouncementDialog
│   ├── messages/     # MessageList, MessageDetail, ComposeDialog
│   ├── notifications/# NotificationBell, NotificationCenter
│   ├── users/        # UserTable, UserAvatar
│   └── common/       # RoleGuard, ConfirmDialog, LoadingSpinner, EmptyState
├── pages/            # LoginPage, DashboardPage, CalendarPage, AnnouncementsPage,
│                     # MessagesPage, NotificationsPage, UsersPage, ProfilePage
├── router/           # createBrowserRouter, ProtectedRoute, ManagerRoute
├── theme/            # MUI createTheme (indigo/purple palette)
└── utils/            # eventColors map, date-fns wrappers
```

---

## Firestore Data Model

| Collection | Key Fields |
|---|---|
| `users/{uid}` | `displayName`, `email`, `role: "manager"\|"user"`, `createdAt` |
| `users/{uid}/fcmTokens/{token}` | `token`, `deviceInfo`, `createdAt` |
| `events/{id}` | `title`, `startDateTime`, `endDateTime`, `eventType`, `assignedUserIds`, `createdBy` |
| `announcements/{id}` | `title`, `body`, `authorId`, `pinned`, `readBy[]` |
| `messages/{id}` | `senderId`, `recipientId` (`"broadcast"` or uid), `subject`, `body`, `readBy[]` |
| `notifications/{id}` | `userId`, `title`, `body`, `type`, `read` |

---

## Local Development

### Prerequisites
- Node 18+ (`nvm use 18`)
- A Firebase project with Auth, Firestore, and Cloud Messaging enabled

### Setup

1. **Clone the repo**
   ```bash
   git clone git@github.com:DaNiELChIoRo/VNTeensApp.git
   cd VNTeensApp
   npm install
   ```

2. **Configure environment variables** — copy `.env.example` to `.env` and fill in your Firebase values:
   ```bash
   cp .env.example .env
   ```

   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_FIREBASE_MEASUREMENT_ID=...
   VITE_FIREBASE_VAPID_KEY=...
   ```

3. **Configure the FCM service worker** — open `public/firebase-messaging-sw.js` and replace the placeholder strings with the same Firebase config values. The service worker runs outside the Vite build pipeline and cannot read `import.meta.env`.

4. **Start the dev server**
   ```bash
   npm run dev
   ```

### Seed a Manager Account

After registering your first account, open the Firebase Console → Firestore → `users/{your-uid}` and set `role` to `"manager"`. All subsequent accounts default to `"user"`.

---

## Deployment (GitHub Pages)

Deployment is fully automated via `.github/workflows/deploy.yml`. Every push to `main` triggers a build and deploys to GitHub Pages.

### One-time setup

1. Go to **Settings → Pages** in your GitHub repo and set Source to **GitHub Actions**.

2. Add the following repository secrets at **Settings → Secrets and variables → Actions**:

   | Secret | Value |
   |---|---|
   | `VITE_FIREBASE_API_KEY` | Your Firebase API key |
   | `VITE_FIREBASE_AUTH_DOMAIN` | e.g. `your-project.firebaseapp.com` |
   | `VITE_FIREBASE_PROJECT_ID` | Your project ID |
   | `VITE_FIREBASE_STORAGE_BUCKET` | e.g. `your-project.appspot.com` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
   | `VITE_FIREBASE_APP_ID` | Your app ID |
   | `VITE_FIREBASE_MEASUREMENT_ID` | Your measurement ID |
   | `VITE_FIREBASE_VAPID_KEY` | Your VAPID public key (for FCM) |

3. Push to `main` — the Actions workflow handles the rest.

> **Note:** The `.env` file is git-ignored and never committed. All secrets are injected at build time by GitHub Actions.

---

## Firebase Security Rules

Rules are defined in `firestore.rules` and can be deployed with:

```bash
firebase deploy --only firestore:rules
```

Summary:
- **users** — owner reads own doc; manager reads all; only manager can change `role`
- **events** — manager full CRUD; users read only events they're assigned to
- **announcements** — all authenticated users read; only manager creates/deletes; any user can update `readBy`
- **messages** — manager creates; recipient reads; only `readBy` updatable by recipient
- **notifications** — user reads/updates own notifications only

---

## PWA Icons

Place the following files in `public/icons/` before deploying:

| File | Size | Purpose |
|---|---|---|
| `icon-192.png` | 192×192 | Standard PWA icon |
| `icon-512.png` | 512×512 | Splash screen / store listing |
| `icon-maskable-512.png` | 512×512 | Adaptive icon (Android) — keep content in the inner 80% |

---

## Event Types

| Type | Color |
|---|---|
| Worship | Purple |
| Outreach | Cyan |
| Meeting | Indigo |
| Social | Green |
| Service | Orange |
| Training | Red |
| Other | Grey |

---

## License

MIT
