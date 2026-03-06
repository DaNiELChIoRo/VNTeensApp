import React from 'react'
import { Button, CircularProgress } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import { useTranslation } from 'react-i18next'

interface Props {
  onClick: () => void
  loading?: boolean
}

const GoogleSignInButton: React.FC<Props> = ({ onClick, loading }) => {
  const { t } = useTranslation()

  return (
    <Button
      fullWidth
      variant="outlined"
      size="large"
      startIcon={loading ? <CircularProgress size={18} /> : <GoogleIcon />}
      onClick={onClick}
      disabled={loading}
      sx={{ borderColor: '#dadce0', color: 'text.primary', '&:hover': { borderColor: '#4285f4' } }}
    >
      {t('auth.continueWithGoogle')}
    </Button>
  )
}

export default GoogleSignInButton
