
import HomeDashboard from '@src/components/dashboard/admin/HomeDashboard'
import { HashRouter, Route, Routes } from 'react-router-dom'
import AdminLogin from '@components/identity/AdminLogin'
import { Box } from '@mui/material'
import ReviewDashboard from '@components/dashboard/admin/ReviewDashboard'
import AppStatusDashboard from '@src/components/dashboard/admin/AppStatusDashboard'
import AppLogsDashboard from '@src/components/dashboard/admin/AppLogsDashboard'
import ReviewPreviousVersionDashboard from '@src/components/dashboard/admin/ReviewPreviousVerisonDashboard'
import AppVersionListDashboard from '@src/components/dashboard/admin/AppVersionListDashboard'

function App() {
  return (
    <Box
      sx={{
        height: '100vh',
      }}
    >
      <HashRouter>
        <Routes>
          <Route
            path='/deploy/app/:appId'
            element={<ReviewDashboard />}
          />
          <Route
            path='/deployPreviousVersion/app/:appId/version/:versionId'
            element={<ReviewPreviousVersionDashboard />}
          />
          <Route
            path='/deploy/appStatus/:appId'
            element={<AppStatusDashboard />}
          />
          <Route
            path='/deploy/appLogs/:appId/node/:nodeId'
            element={<AppLogsDashboard />}
          />
          <Route
            path='/deploy/appVersions/:appId'
            element={<AppVersionListDashboard />}
          />
          <Route path='/login' element={<AdminLogin />} />
          <Route path='/' element={<HomeDashboard />} />
        </Routes>
      </HashRouter>
    </Box>
  )
}

export default App
