import React, { useState } from 'react'
import { Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import SideNav from './SideNav'
import BottomNav from './BottomNav'
import { useFCM } from '../../hooks/useFCM'

const DRAWER_WIDTH = 240

const AppShell: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  useFCM()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <TopBar onMenuClick={() => setMobileOpen(true)} drawerWidth={DRAWER_WIDTH} />
      <SideNav
        width={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          pb: { xs: 10, md: 3 },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
      <BottomNav />
    </Box>
  )
}

export default AppShell
