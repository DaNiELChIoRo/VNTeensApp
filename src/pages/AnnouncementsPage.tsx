import React, { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useAnnouncements } from '../hooks/useAnnouncements'
import AnnouncementCard from '../components/announcements/AnnouncementCard'
import AnnouncementDialog from '../components/announcements/AnnouncementDialog'
import RoleGuard from '../components/common/RoleGuard'
import EmptyState from '../components/common/EmptyState'
import ConfirmDialog from '../components/common/ConfirmDialog'
import CampaignIcon from '@mui/icons-material/Campaign'
import { deleteAnnouncement } from '../services/announcementService'
import { useToast } from '../contexts/NotificationContext'

const AnnouncementsPage: React.FC = () => {
  const { data: announcements } = useAnnouncements()
  const { showToast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteAnnouncement(deleteId)
      showToast('Announcement deleted', 'success')
    } catch {
      showToast('Failed to delete', 'error')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Announcements</Typography>
        <RoleGuard requiredRole="manager">
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
            Post
          </Button>
        </RoleGuard>
      </Box>

      {announcements.length === 0 ? (
        <EmptyState message="No announcements yet" icon={CampaignIcon} />
      ) : (
        announcements.map((a) => (
          <AnnouncementCard key={a.id} announcement={a} onDelete={setDeleteId} />
        ))
      )}

      <AnnouncementDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement?"
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  )
}

export default AnnouncementsPage
