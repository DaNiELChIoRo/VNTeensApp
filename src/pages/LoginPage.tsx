import React, { useEffect } from 'react'
import { Box, Card, CardContent, Typography, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import { useAuth } from '../hooks/useAuth'

const LoginPage: React.FC = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser) navigate('/dashboard', { replace: true })
  }, [currentUser, navigate])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 420, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={800} color="primary">
              VNTeens
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Youth Group Management App
            </Typography>
          </Box>
          <LoginForm />
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginPage
