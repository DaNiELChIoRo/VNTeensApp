# VNTeens App — React PWA Implementation Plan

## Context
Greenfield project in an empty directory. Goal is a production-ready React PWA for a youth group that allows managers to schedule events/people on a calendar and communicate via announcements and messages, while regular users can view their schedules and receive push notifications.

---

## Stack
| Layer | Choice |
|---|---|
| Framework | Vite + React + TypeScript |
| UI | Material UI (MUI v5) |
| Calendar | FullCalendar (react wrapper) |
| Routing | React Router v6 |
| Server state | TanStack React Query |
| Firebase | Auth, Firestore, FCM, Storage |
| PWA | vite-plugin-pwa + Workbox |

---

## Firestore Data Model

| Collection | Key Fields |
|---|---|
| `users/{uid}` | `displayName`, `email`, `photoURL`, `role: "manager"\|"user"`, `fcmTokens: string[]`, `createdAt` |
| `events/{eventId}` | `title`, `description`, `location`, `startDateTime`, `endDateTime`, `allDay`, `eventType`, `color`, `assignedUserIds: string[]`, `createdBy` |
| `announcements/{id}` | `title`, `body`, `authorId`, `createdAt`, `readBy: string[]`, `pinned` |
| `messages/{id}` | `senderId`, `recipientId` ("broadcast" or uid), `subject`, `body`, `sentAt`, `readBy: string[]` |
| `notifications/{id}` | `userId`, `title`, `body`, `type`, `referenceId`, `read`, `createdAt` |
| `users/{uid}/fcmTokens/{token}` | `token`, `deviceInfo`, `createdAt` (subcollection, token as doc ID) |

---

## Project File Structure

```
VNTeensApp/
├── public/
│   ├── firebase-messaging-sw.js   ← FCM background SW (must be at root)
│   └── icons/                     ← PWA icons (192, 512, maskable)
├── src/
│   ├── firebase/
│   │   ├── config.ts              ← initializeApp from .env vars
│   │   ├── auth.ts                ← signIn, Google OAuth, signOut
│   │   ├── firestore.ts           ← db export
│   │   ├── messaging.ts           ← requestPermission, getToken, onMessage
│   │   └── storage.ts             ← uploadFile, getDownloadURL
│   ├── types/                     ← TypeScript interfaces for all entities
│   ├── contexts/
│   │   ├── AuthContext.tsx        ← currentUser, role, loading, login, logout
│   │   └── NotificationContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useEvents.ts           ← React Query + onSnapshot bridge
│   │   ├── useAnnouncements.ts
│   │   ├── useMessages.ts
│   │   ├── useNotifications.ts
│   │   └── useFCM.ts              ← permission request + token registration
│   ├── services/
│   │   ├── eventService.ts        ← CRUD for events
│   │   ├── announcementService.ts
│   │   ├── messageService.ts
│   │   ├── notificationService.ts
│   │   └── userService.ts
│   ├── components/
│   │   ├── layout/                ← AppShell, TopBar, SideNav, BottomNav
│   │   ├── auth/                  ← LoginForm, GoogleSignInButton
│   │   ├── calendar/              ← CalendarView, EventPopover, EventLegend
│   │   ├── events/                ← EventDialog, EventForm, EventTypeChip
│   │   ├── announcements/         ← AnnouncementFeed, Card, Dialog
│   │   ├── messages/              ← MessageList, MessageDetail, ComposeDialog
│   │   ├── notifications/         ← NotificationBell, NotificationCenter
│   │   ├── users/                 ← UserTable, UserAvatar
│   │   └── common/                ← RoleGuard, ConfirmDialog, LoadingSpinner, EmptyState
│   ├── pages/                     ← LoginPage, DashboardPage, CalendarPage,
│   │                                 AnnouncementsPage, MessagesPage,
│   │                                 NotificationsPage, UsersPage, ProfilePage
│   ├── router/
│   │   ├── index.tsx              ← createBrowserRouter with all routes
│   │   ├── ProtectedRoute.tsx     ← redirect to /login if not authed
│   │   └── ManagerRoute.tsx       ← redirect to /dashboard if not manager
│   ├── services/
│   ├── theme/
│   │   └── theme.ts               ← MUI createTheme (blue/purple palette)
│   ├── utils/
│   │   ├── eventColors.ts         ← eventType → hex color map
│   │   └── formatDate.ts          ← date-fns wrappers
│   ├── App.tsx                    ← ThemeProvider + QueryClientProvider + RouterProvider
│   └── main.tsx
├── .env                           ← Firebase config + VAPID key (never commit)
├── vite.config.ts                 ← VitePWA plugin config
└── firestore.rules
```

---

## Key Dependencies (install commands)

```bash
npm create vite@latest . -- --template react-ts
npm install

npm install firebase
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install react-router-dom
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid \
            @fullcalendar/timegrid @fullcalendar/list @fullcalendar/interaction
npm install date-fns uuid
npm install -D vite-plugin-pwa workbox-window @types/uuid
```

---

## Critical Architecture Decisions

### 1. Firestore Real-Time + React Query Bridge
Firestore's `onSnapshot` pushes live updates into React Query cache via `queryClient.setQueryData`. The `queryFn` returns a resolved empty array; `staleTime: Infinity` prevents React Query from re-fetching (onSnapshot owns freshness).

### 2. Role-Based Calendar Filtering
- **Manager**: queries all `events` collection
- **Regular user**: `where('assignedUserIds', 'array-contains', uid)`

### 3. FCM Two-Service-Worker Setup
- `vite-plugin-pwa` generates `sw.js` (Workbox, asset caching)
- `firebase-messaging-sw.js` in `/public/` handles background FCM push
- Workbox config must `navigateFallbackDenylist` the FCM SW path

### 4. RoleGuard Component (inline UI guards)
```tsx
<RoleGuard requiredRole="manager">
  <Button onClick={openCreateDialog}>Create Event</Button>
</RoleGuard>
```

### 5. FCM Token as Firestore Document ID
Storing token as `users/{uid}/fcmTokens/{token}` ensures idempotent re-registration across logins/refreshes.

---

## Firebase Security Rules Summary

- `users`: owner reads own doc; manager reads all; only manager sets `role` field
- `events`: manager full CRUD; users read only if in `assignedUserIds`
- `announcements`: all auth users read; only manager creates/deletes; any user updates `readBy`
- `messages`: manager creates; recipient + manager read; only `readBy` field updatable by others
- `notifications`: user reads own; only `read` field updatable by owner

---

## Implementation Phases

| Phase | Contents | Files Created |
|---|---|---|
| 1 – Foundation | Scaffold, deps, Vite config, Firebase init, MUI theme | `vite.config.ts`, `.env`, `firebase/config.ts`, `theme/theme.ts`, `App.tsx` |
| 2 – Auth | Login page, AuthContext, route guards | `firebase/auth.ts`, `contexts/AuthContext.tsx`, `pages/LoginPage.tsx`, `router/` |
| 3 – Layout Shell | AppShell, TopBar, SideNav, BottomNav | `components/layout/*` |
| 4 – Events & Calendar | FullCalendar integration, CRUD, drag & drop | `services/eventService.ts`, `hooks/useEvents.ts`, `components/calendar/*`, `components/events/*`, `pages/CalendarPage.tsx` |
| 5 – Announcements | Feed, read tracking, manager create/edit | `services/announcementService.ts`, `components/announcements/*`, `pages/AnnouncementsPage.tsx` |
| 6 – Messages | Inbox, compose, broadcast support | `services/messageService.ts`, `components/messages/*`, `pages/MessagesPage.tsx` |
| 7 – Push Notifications | FCM SW, permission flow, token storage, in-app center | `public/firebase-messaging-sw.js`, `firebase/messaging.ts`, `hooks/useFCM.ts`, `components/notifications/*` |
| 8 – User Management | Manager user table, role assignment | `services/userService.ts`, `components/users/*`, `pages/UsersPage.tsx` |
| 9 – Dashboard | Summary widgets: upcoming events, unread counts | `pages/DashboardPage.tsx` |
| 10 – PWA Polish | Icons, manifest, offline page, Lighthouse audit | `public/icons/*`, Workbox config |
| 11 – Security Rules | Deploy Firestore rules, test with emulator | `firestore.rules` |
| 12 – Deploy | Firebase Hosting deploy, production FCM test | `firebase.json`, `.firebaserc` |

---

## Verification Plan

1. **Auth**: Email login + Google OAuth work; new user gets `role: "user"`; manager account works with a seeded doc in Firestore
2. **Route Guards**: Non-auth user redirected to `/login`; regular user can't access `/users`
3. **Calendar**: Manager sees all events; regular user sees only assigned events; drag & drop updates Firestore
4. **Announcements**: Manager creates announcement; regular user sees it; read/unread state persists
5. **Messages**: Manager sends broadcast; all users see it; individual message delivered to correct user
6. **Push Notifications**: Grant permission → token stored in Firestore; send test FCM message from Firebase Console → notification appears in background (SW) and foreground (Snackbar)
7. **PWA**: Chrome DevTools > Application > Manifest shows valid manifest; Lighthouse PWA score ≥ 90; install prompt appears on mobile Chrome
8. **Offline**: Navigate to app offline → cached shell renders; Firestore cached data shows
