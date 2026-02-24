import React, { useState } from 'react'
import {
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Typography,
  Box,
  Link,
} from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import GoogleSignInButton from './GoogleSignInButton'
import { resetPassword } from '../../firebase/auth'

const LoginForm: React.FC = () => {
  const { loginWithEmail, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginWithEmail(email, password)
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Login failed'
      setError(msg.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim())
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Google sign-in failed'
      setError(msg.replace('Firebase: ', '').trim())
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleReset = async () => {
    if (!email) { setError('Enter your email first'); return }
    try {
      await resetPassword(email)
      setResetSent(true)
    } catch {
      setError('Could not send reset email')
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {resetSent && <Alert severity="success">Password reset email sent!</Alert>}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        autoComplete="email"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        autoComplete="current-password"
      />
      <Box sx={{ textAlign: 'right', mt: -1 }}>
        <Link component="button" type="button" variant="body2" onClick={handleReset}>
          Forgot password?
        </Link>
      </Box>
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={loading}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
      >
        Sign In
      </Button>

      <Divider>
        <Typography variant="caption" color="text.secondary">
          OR
        </Typography>
      </Divider>

      <GoogleSignInButton onClick={handleGoogle} loading={googleLoading} />
    </Box>
  )
}

export default LoginForm
