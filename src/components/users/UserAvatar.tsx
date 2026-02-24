import React from 'react'
import { Avatar, Tooltip } from '@mui/material'
import { AppUser } from '../../types'

interface Props {
  user: Pick<AppUser, 'displayName' | 'photoURL' | 'email'>
  size?: number
}

const UserAvatar: React.FC<Props> = ({ user, size = 36 }) => (
  <Tooltip title={user.displayName || user.email}>
    <Avatar
      src={user.photoURL ?? undefined}
      alt={user.displayName || user.email}
      sx={{ width: size, height: size, fontSize: size * 0.4, bgcolor: 'primary.main' }}
    >
      {(user.displayName || user.email)?.[0]?.toUpperCase()}
    </Avatar>
  </Tooltip>
)

export default UserAvatar
