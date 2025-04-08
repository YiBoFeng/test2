import Dashboard from '@components/dashboard/Dashboard'
import AppList from '@components/list/AppList'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Login from '@components/identity/Login'
import { Box } from '@mui/material'
import AppLogsDashboard from '@src/components/dashboard/AppLogsDashboard'

function App() {
  return (
    <Box
      sx={{
        height: '100vh',
      }}
    >
      <HashRouter>
        <Routes>
          <Route path='/' element={<AppList />} />
          <Route path='/login' element={<Login />} />
          <Route path='/app'>
            <Route path=':appId' element={<Dashboard />} />
            <Route path=':appId/appLogs' element={<AppLogsDashboard />} />
          </Route>
        </Routes>
      </HashRouter>
    </Box>
  )
}

export default App
