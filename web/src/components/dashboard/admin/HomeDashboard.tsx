import { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TabPanel from '@components/common/TabPanel'
import { Box, LinearProgress } from '@mui/material'
import { CommonAppBarContainer } from '@components/common/CommonAppBarContainer'
import useLogout from '@hooks/useLogout'
import GlobalAppList from '@components/list/GlobalAppList'
import { getGlobalAppList } from '@src/apis/getGlobalAppList'
import { App } from '@src/models/App'
import { getUserToken } from '@src/apis/getUserToken'
import { useLocation } from 'react-router-dom'

export default function HomeDashboard() {
  const location = useLocation()
  const [tab, setTab] = useState(location.state?.tab || 0)
  const { logoutButton } = useLogout()
  const handleChange = (_: unknown, newValue: number) => {
    setTab(newValue)
  }
  const [globalApps, setGlobalApps] = useState<App[]>([])
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.all([getGlobalAppList(), getUserToken()]).then(([apps, token]) => {
      setGlobalApps(apps)
      setAccessToken(token as unknown as string)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <LinearProgress />
  }

  const content = (
    <>
      <Box>
        <Tabs
          value={tab}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          <Tab label='Sandbox Apps' />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <GlobalAppList matchedApps={globalApps} accessToken={accessToken} />
        </TabPanel>
      </Box>
    </>
  )
  return (
    <CommonAppBarContainer menus={[logoutButton]}>
      {content}
    </CommonAppBarContainer>
  )
}
