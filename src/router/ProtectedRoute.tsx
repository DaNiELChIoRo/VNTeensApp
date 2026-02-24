import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/common/LoadingSpinner'

const ProtectedRoute: React.FC = () => {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingSpinner fullScreen />
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />
  return <Outlet />
}

export default ProtectedRoute
