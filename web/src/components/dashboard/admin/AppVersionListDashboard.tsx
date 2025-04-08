import { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TabPanel from '@components/common/TabPanel'
import { Box } from '@mui/material'
import { CommonAppBarContainer, CommonAppBarMenu } from '@components/common/CommonAppBarContainer'
import { useNavigate, useParams } from 'react-router-dom'
import useLogout from '@hooks/useLogout'
import AppVersionList from '@components/list/admin/AppVersionList'

export default function AppVersionListDashboard() {
  const [tab, setTab] = useState(0)
  const { logoutButton } = useLogout()
  const navigate = useNavigate()
  const params = useParams()
  const appId = params['appId'] as string
  const handleChange = (_: unknown, newValue: number) => {
    setTab(newValue)
  }

  const content = (
    <>
      <Box>
        <Tabs
          value={tab}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          <Tab label='App Versions' />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <AppVersionList appId={appId} />
        </TabPanel>
      </Box>
    </>
  )
  const backButton: CommonAppBarMenu = {
    title: 'BACK',
    onClick: () => {
      navigate('/', { state: { tab: 0 } })
    },
  }
  return (
    <CommonAppBarContainer menus={[backButton, logoutButton]}>
      {content}
    </CommonAppBarContainer>
  )
}
