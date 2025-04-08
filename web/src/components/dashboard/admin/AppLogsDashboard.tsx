import { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TabPanel from '@components/common/TabPanel'
import { Box } from '@mui/material'
import { CommonAppBarContainer, CommonAppBarMenu } from '@components/common/CommonAppBarContainer'
import { useNavigate, useParams } from 'react-router-dom'
import useLogout from '@hooks/useLogout'
import { APILogPanel } from '@components/function/admin/APILogPanel'
import { FuncTypeSchema } from '@src/models/Func'

export default function AppLogsDashboard() {
  const [tab, setTab] = useState(0)
  const { logoutButton } = useLogout()
  const navigate = useNavigate()
  const params = useParams()
  const appId = params['appId'] as string
  const nodeId = params['nodeId'] as string
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
          <Tab label='Identity Function' />
          <Tab label='Build Function' />
          <Tab label='Action Function' />
          <Tab label='Redirect Function' />
          <Tab label='Webhook Function' />
        </Tabs>
        {FuncTypeSchema.options.map((type, index) => (
          <TabPanel key={type} value={tab} index={index}>
            <div style={{ marginTop: '1em' }}></div>
            <APILogPanel nodeId={nodeId} appId={appId} functionType={type} />
          </TabPanel>
        ))}
      </Box>
    </>
  )
  const backButton: CommonAppBarMenu = {
    title: 'BACK',
    onClick: () => {
      navigate(`/deploy/appStatus/${appId}`)
    },
  }
  return (
    <CommonAppBarContainer menus={[backButton, logoutButton]}>
      {content}
    </CommonAppBarContainer>
  )
}
