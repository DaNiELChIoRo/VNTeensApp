import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/common/LoadingSpinner'

const ManagerRoute: React.FC = () => {
  const { userRole, loading } = useAuth()

  if (loading) return <LoadingSpinner fullScreen />
  if (userRole !== 'manager') return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export default ManagerRoute
