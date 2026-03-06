import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AppUser, UserRole } from '../../types'
import { updateUserRole } from '../../services/userService'
import { useToast } from '../../contexts/NotificationContext'
import UserAvatar from './UserAvatar'
import { formatDate } from '../../utils/formatDate'

interface Props {
  users: AppUser[]
}

const UserTable: React.FC<Props> = ({ users }) => {
  const { showToast } = useToast()
  const { t } = useTranslation()
  const [updating, setUpdating] = useState<string | null>(null)

  const handleRoleChange = async (uid: string, role: UserRole) => {
    setUpdating(uid)
    try {
      await updateUserRole(uid, role)
      showToast(t('users.roleUpdated'), 'success')
    } catch {
      showToast(t('users.failedToUpdateRole'), 'error')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <TableContainer component={Paper} elevation={0} variant="outlined">
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'background.default' }}>
            <TableCell>{t('users.user')}</TableCell>
            <TableCell>{t('users.email')}</TableCell>
            <TableCell>{t('users.role')}</TableCell>
            <TableCell>{t('users.joined')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.uid} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <UserAvatar user={user} />
                  <Typography variant="body2" fontWeight={600}>
                    {user.displayName}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  size="small"
                  disabled={updating === user.uid}
                  onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="user">{t('users.user')}</MenuItem>
                  <MenuItem value="manager">{t('users.manager')}</MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <Typography variant="caption" color="text.secondary">
                  {user.createdAt ? formatDate(user.createdAt) : '—'}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default UserTable
