import React, { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteAnnouncement(deleteId)
      showToast(t('announcements.deleted'), 'success')
    } catch {
      showToast(t('announcements.failedToDelete'), 'error')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>{t('announcements.title')}</Typography>
        <RoleGuard requiredRole="manager">
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
            {t('announcements.post')}
          </Button>
        </RoleGuard>
      </Box>

      {announcements.length === 0 ? (
        <EmptyState message={t('announcements.empty')} icon={CampaignIcon} />
      ) : (
        announcements.map((a) => (
          <AnnouncementCard key={a.id} announcement={a} onDelete={setDeleteId} />
        ))
      )}

      <AnnouncementDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />

      <ConfirmDialog
        open={Boolean(deleteId)}
        title={t('announcements.deleteTitle')}
        message={t('announcements.deleteConfirm')}
        confirmLabel={t('common.delete')}
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  )
}

export default AnnouncementsPage
