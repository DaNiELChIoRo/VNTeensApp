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
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import GoogleSignInButton from './GoogleSignInButton'
import { resetPassword } from '../../firebase/auth'

const LoginForm: React.FC = () => {
  const { loginWithEmail, loginWithGoogle } = useAuth()
  const { t } = useTranslation()
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
      const msg = (err as { message?: string })?.message ?? t('auth.loginFailed')
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
      const msg = (err as { message?: string })?.message ?? t('auth.googleFailed')
      setError(msg.replace('Firebase: ', '').trim())
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleReset = async () => {
    if (!email) { setError(t('auth.enterEmail')); return }
    try {
      await resetPassword(email)
      setResetSent(true)
    } catch {
      setError(t('auth.resetFailed'))
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {resetSent && <Alert severity="success">{t('auth.resetSent')}</Alert>}

      <TextField
        label={t('auth.email')}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        fullWidth
        autoComplete="email"
      />
      <TextField
        label={t('auth.password')}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        fullWidth
        autoComplete="current-password"
      />
      <Box sx={{ textAlign: 'right', mt: -1 }}>
        <Link component="button" type="button" variant="body2" onClick={handleReset}>
          {t('auth.forgotPassword')}
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
        {t('auth.signIn')}
      </Button>

      <Divider>
        <Typography variant="caption" color="text.secondary">
          {t('common.or')}
        </Typography>
      </Divider>

      <GoogleSignInButton onClick={handleGoogle} loading={googleLoading} />
    </Box>
  )
}

export default LoginForm
