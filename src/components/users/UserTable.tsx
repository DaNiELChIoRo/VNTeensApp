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
  const [updating, setUpdating] = useState<string | null>(null)

  const handleRoleChange = async (uid: string, role: UserRole) => {
    setUpdating(uid)
    try {
      await updateUserRole(uid, role)
      showToast('Role updated', 'success')
    } catch {
      showToast('Failed to update role', 'error')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <TableContainer component={Paper} elevation={0} variant="outlined">
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'background.default' }}>
            <TableCell>User</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Joined</TableCell>
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
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
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
