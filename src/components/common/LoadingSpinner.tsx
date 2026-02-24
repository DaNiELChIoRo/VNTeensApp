import React from 'react'
import { Box, CircularProgress } from '@mui/material'

interface Props {
  fullScreen?: boolean
  size?: number
}

const LoadingSpinner: React.FC<Props> = ({ fullScreen, size = 40 }) => {
  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress size={size} />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress size={size} />
    </Box>
  )
}

export default LoadingSpinner
