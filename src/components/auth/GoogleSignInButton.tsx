import React from 'react'
import { Button, CircularProgress } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'

interface Props {
  onClick: () => void
  loading?: boolean
}

const GoogleSignInButton: React.FC<Props> = ({ onClick, loading }) => (
  <Button
    fullWidth
    variant="outlined"
    size="large"
    startIcon={loading ? <CircularProgress size={18} /> : <GoogleIcon />}
    onClick={onClick}
    disabled={loading}
    sx={{ borderColor: '#dadce0', color: 'text.primary', '&:hover': { borderColor: '#4285f4' } }}
  >
    Continue with Google
  </Button>
)

export default GoogleSignInButton
