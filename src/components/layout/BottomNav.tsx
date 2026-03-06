import React from 'react'
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CampaignIcon from '@mui/icons-material/Campaign'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ROUTES = ['/dashboard', '/calendar', '/announcements', '/messages', '/notifications']

const BottomNav: React.FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const value = ROUTES.indexOf(pathname) === -1 ? 0 : ROUTES.indexOf(pathname)

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: { md: 'none' },
        zIndex: 1100,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <BottomNavigation value={value} showLabels>
        <BottomNavigationAction label={t('nav.home')}          icon={<DashboardIcon />}     onClick={() => navigate('/dashboard')} />
        <BottomNavigationAction label={t('nav.calendar')}      icon={<CalendarMonthIcon />} onClick={() => navigate('/calendar')} />
        <BottomNavigationAction label={t('nav.posts')}         icon={<CampaignIcon />}      onClick={() => navigate('/announcements')} />
        <BottomNavigationAction label={t('nav.messages')}      icon={<MailIcon />}          onClick={() => navigate('/messages')} />
        <BottomNavigationAction label={t('nav.alerts')}        icon={<NotificationsIcon />} onClick={() => navigate('/notifications')} />
      </BottomNavigation>
    </Paper>
  )
}

export default BottomNav
