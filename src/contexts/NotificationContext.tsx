import React, { createContext, useContext, useState, useCallback } from 'react'
import { Snackbar, Alert, AlertColor } from '@mui/material'

interface Toast {
  message: string
  severity: AlertColor
}

interface NotificationContextValue {
  showToast: (message: string, severity?: AlertColor) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<Toast | null>(null)
  const [open, setOpen] = useState(false)

  const showToast = useCallback((message: string, severity: AlertColor = 'info') => {
    setToast({ message, severity })
    setOpen(true)
  }, [])

  const handleClose = () => setOpen(false)

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={toast?.severity ?? 'info'} variant="filled" sx={{ width: '100%' }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}

export const useToast = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useToast must be used within NotificationProvider')
  return ctx
}
