import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react'
import { ThemeProvider, CssBaseline, PaletteMode } from '@mui/material'
import createAppTheme from '../theme/theme'

const STORAGE_KEY = 'vnteens-theme-mode'

const getSystemMode = (): PaletteMode =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

interface ThemeContextValue {
  mode: PaletteMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  toggleTheme: () => {},
})

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
    return getSystemMode()
  })

  // Track whether the user has manually overridden the system preference
  const [userOverride, setUserOverride] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) !== null
  )

  // Listen for OS-level dark/light mode changes (works on iOS 13+, Android, macOS)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      // Only follow system changes if the user hasn't picked a preference manually
      if (!userOverride) {
        setMode(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [userOverride])

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
    setUserOverride(true)
  }, [])

  const theme = useMemo(() => createAppTheme(mode), [mode])

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useThemeMode = () => useContext(ThemeContext)
