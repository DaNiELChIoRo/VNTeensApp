import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { UserRole } from '../../types'

interface Props {
  requiredRole: UserRole
  children: React.ReactNode
  fallback?: React.ReactNode
}

const RoleGuard: React.FC<Props> = ({ requiredRole, children, fallback = null }) => {
  const { userRole } = useAuth()
  if (userRole !== requiredRole) return <>{fallback}</>
  return <>{children}</>
}

export default RoleGuard
