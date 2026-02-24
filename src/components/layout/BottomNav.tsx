import React from 'react'
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CampaignIcon from '@mui/icons-material/Campaign'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useNavigate, useLocation } from 'react-router-dom'

const ROUTES = ['/dashboard', '/calendar', '/announcements', '/messages', '/notifications']

const BottomNav: React.FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const value = ROUTES.indexOf(pathname) === -1 ? 0 : ROUTES.indexOf(pathname)

  return (
    <Paper
      elevation={3}
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { md: 'none' }, zIndex: 1100 }}
    >
      <BottomNavigation
        value={value}
        onChange={(_, newVal) => navigate(ROUTES[newVal])}
        showLabels
      >
        <BottomNavigationAction label="Home" icon={<DashboardIcon />} />
        <BottomNavigationAction label="Calendar" icon={<CalendarMonthIcon />} />
        <BottomNavigationAction label="Posts" icon={<CampaignIcon />} />
        <BottomNavigationAction label="Messages" icon={<MailIcon />} />
        <BottomNavigationAction label="Alerts" icon={<NotificationsIcon />} />
      </BottomNavigation>
    </Paper>
  )
}

export default BottomNav
