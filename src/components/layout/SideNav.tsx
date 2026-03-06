import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
  Toolbar,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CampaignIcon from '@mui/icons-material/Campaign'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import PeopleIcon from '@mui/icons-material/People'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  width: number
  mobileOpen: boolean
  onClose: () => void
}

const SideNav: React.FC<Props> = ({ width, mobileOpen, onClose }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, userRole, logout } = useAuth()
  const { t } = useTranslation()

  const NAV_ITEMS = [
    { label: t('nav.dashboard'), path: '/dashboard', icon: <DashboardIcon /> },
    { label: t('nav.calendar'), path: '/calendar', icon: <CalendarMonthIcon /> },
    { label: t('nav.announcements'), path: '/announcements', icon: <CampaignIcon /> },
    { label: t('nav.messages'), path: '/messages', icon: <MailIcon /> },
    { label: t('nav.notifications'), path: '/notifications', icon: <NotificationsIcon /> },
    { label: t('nav.users'), path: '/users', icon: <PeopleIcon />, managerOnly: true },
  ]

  const handleNav = (path: string) => {
    navigate(path)
    onClose()
  }

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          src={currentUser?.photoURL ?? undefined}
          sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
        >
          {currentUser?.displayName?.[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={700} noWrap>
            {currentUser?.displayName}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
            {userRole}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ flex: 1, pt: 1 }}>
        {NAV_ITEMS.filter((item) => !item.managerOnly || userRole === 'manager').map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNav(item.path)}
              sx={{
                mx: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNav('/profile')} sx={{ mx: 1, borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary={t('nav.profile')} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={logout} sx={{ mx: 1, borderRadius: 2, color: 'error.main' }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={t('nav.signOut')} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box component="nav" sx={{ width: { md: width }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width } }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width } }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  )
}

export default SideNav
