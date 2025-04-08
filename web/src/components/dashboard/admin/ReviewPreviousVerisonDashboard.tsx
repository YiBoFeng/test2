import { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TabPanel from '@components/common/TabPanel'
import { Box } from '@mui/material'
import { CommonAppBarContainer, CommonAppBarMenu } from '@components/common/CommonAppBarContainer'
import { useNavigate, useParams } from 'react-router-dom'
import useLogout from '@hooks/useLogout'
import DeployPreviousVersion from '@components/deploy/DeployPreviousVersion'

export default function ReviewPreviousVersionDashboard() {
  const [tab, setTab] = useState(0)
  const { logoutButton } = useLogout()
  const navigate = useNavigate()
  const params = useParams()
  const appId = params['appId'] as string
  const versionId = params['versionId'] as string
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
          <Tab label='App Deploy' />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <DeployPreviousVersion appId={appId} versionId={versionId} />
        </TabPanel>
      </Box>
    </>
  )
  const backButton: CommonAppBarMenu = {
    title: 'BACK',
    onClick: () => {
      navigate(`/deploy/appVersions/${appId}`)
    },
  }
  return (
    <CommonAppBarContainer menus={[backButton, logoutButton]}>
      {content}
    </CommonAppBarContainer>
  )
}
