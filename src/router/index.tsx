import React, { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import ManagerRoute from './ManagerRoute'
import LoadingSpinner from '../components/common/LoadingSpinner'
import AppShell from '../components/layout/AppShell'

const LoginPage = lazy(() => import('../pages/LoginPage'))
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const CalendarPage = lazy(() => import('../pages/CalendarPage'))
const AnnouncementsPage = lazy(() => import('../pages/AnnouncementsPage'))
const MessagesPage = lazy(() => import('../pages/MessagesPage'))
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'))
const UsersPage = lazy(() => import('../pages/UsersPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))

const wrap = (el: React.ReactNode) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>{el}</Suspense>
)

export const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: wrap(<LoginPage />),
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <AppShell />,
          children: [
            { path: '/', element: wrap(<DashboardPage />) },
            { path: '/dashboard', element: wrap(<DashboardPage />) },
            { path: '/calendar', element: wrap(<CalendarPage />) },
            { path: '/announcements', element: wrap(<AnnouncementsPage />) },
            { path: '/messages', element: wrap(<MessagesPage />) },
            { path: '/notifications', element: wrap(<NotificationsPage />) },
            { path: '/profile', element: wrap(<ProfilePage />) },
            {
              element: <ManagerRoute />,
              children: [
                { path: '/users', element: wrap(<UsersPage />) },
              ],
            },
          ],
        },
      ],
    },
  ],
  { basename: '/VNTeensApp' }
)
