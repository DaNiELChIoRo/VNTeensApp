import React from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../../hooks/useAuth'
import NotificationBell from '../notifications/NotificationBell'

interface Props {
  onMenuClick: () => void
  drawerWidth: number
}

const TopBar: React.FC<Props> = ({ onMenuClick, drawerWidth }) => {
  const { currentUser } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Toolbar>
        {isMobile && (
          <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}>
          VNTeens
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationBell />
          <Avatar
            src={currentUser?.photoURL ?? undefined}
            alt={currentUser?.displayName ?? 'User'}
            sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}
          >
            {currentUser?.displayName?.[0]?.toUpperCase()}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
