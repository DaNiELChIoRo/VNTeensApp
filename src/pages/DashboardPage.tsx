import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CampaignIcon from '@mui/icons-material/Campaign'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useTranslation } from 'react-i18next'
import { useEvents } from '../hooks/useEvents'
import { useAnnouncements } from '../hooks/useAnnouncements'
import { useMessages } from '../hooks/useMessages'
import { useNotifications } from '../hooks/useNotifications'
import { useAuth } from '../hooks/useAuth'
import { formatDateTime } from '../utils/formatDate'
import EventTypeChip from '../components/events/EventTypeChip'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number | string
  color: string
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1.5, bgcolor: color, borderRadius: 2, color: '#fff', display: 'flex' }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800}>{value}</Typography>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
)

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth()
  const { t } = useTranslation()
  const { data: events } = useEvents()
  const { data: announcements } = useAnnouncements()
  const { data: messages } = useMessages()
  const { unreadCount } = useNotifications()

  const now = new Date()
  const upcomingEvents = events
    .filter((e) => e.startDateTime.toDate() >= now)
    .slice(0, 5)

  const unreadAnnouncements = announcements.filter(
    (a) => currentUser && !a.readBy.includes(currentUser.uid)
  ).length

  const unreadMessages = messages.filter(
    (m) => currentUser && !m.readBy.includes(currentUser.uid)
  ).length

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {t('dashboard.welcome', { name: currentUser?.displayName?.split(' ')[0] })}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard icon={<CalendarTodayIcon />} label={t('dashboard.upcomingEvents')} value={upcomingEvents.length} color="#3f51b5" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard icon={<CampaignIcon />} label={t('dashboard.unreadPosts')} value={unreadAnnouncements} color="#7c4dff" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard icon={<MailIcon />} label={t('dashboard.unreadMessages')} value={unreadMessages} color="#00bcd4" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard icon={<NotificationsIcon />} label={t('dashboard.notifications')} value={unreadCount} color="#ff9800" />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {t('dashboard.upcomingEvents')}
          </Typography>
          {upcomingEvents.length === 0 ? (
            <Typography variant="body2" color="text.secondary">{t('dashboard.noUpcomingEvents')}</Typography>
          ) : (
            <List disablePadding>
              {upcomingEvents.map((event, i) => (
                <React.Fragment key={event.id}>
                  {i > 0 && <Divider />}
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <EventTypeChip eventType={event.eventType} />
                          <Typography variant="body2" fontWeight={600}>{event.title}</Typography>
                        </Box>
                      }
                      secondary={formatDateTime(event.startDateTime)}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default DashboardPage
