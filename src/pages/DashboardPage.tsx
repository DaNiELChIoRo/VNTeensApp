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
  Chip,
  Divider,
} from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CampaignIcon from '@mui/icons-material/Campaign'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
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
        Welcome back, {currentUser?.displayName?.split(' ')[0]} 👋
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<CalendarTodayIcon />} label="Upcoming Events" value={upcomingEvents.length} color="#3f51b5" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<CampaignIcon />} label="Unread Posts" value={unreadAnnouncements} color="#7c4dff" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<MailIcon />} label="Unread Messages" value={unreadMessages} color="#00bcd4" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard icon={<NotificationsIcon />} label="Notifications" value={unreadCount} color="#ff9800" />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Upcoming Events
          </Typography>
          {upcomingEvents.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No upcoming events</Typography>
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
