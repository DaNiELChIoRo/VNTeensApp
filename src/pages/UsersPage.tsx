import React from 'react'
import { Box, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getAllUsers } from '../services/userService'
import UserTable from '../components/users/UserTable'
import LoadingSpinner from '../components/common/LoadingSpinner'

const UsersPage: React.FC = () => {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    staleTime: 30000,
  })

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        User Management
      </Typography>
      {isLoading ? <LoadingSpinner /> : <UserTable users={users} />}
    </Box>
  )
}

export default UsersPage
