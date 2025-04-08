import { useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TabPanel from '@components/common/TabPanel'
import AuthorizationTypeSelector from '../authorization/AuthorizationTypeSelector'
import { BasicInfo } from './BasicInfo'
import ActionList from '../actionList/ActionList'
import Function from '../function/Function'
import { Box } from '@mui/material'
import { CommonAppBarContainer, CommonAppBarMenu } from '@components/common/CommonAppBarContainer'
import { useNavigate, useParams } from 'react-router-dom'
import useDoc from '@hooks/useDoc'
import useLogout from '@hooks/useLogout'

export default function Dashboard() {
  const [tab, setTab] = useState(0)
  const { docListButton, docModal } = useDoc()
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
          <Tab label='Basic Info' />
          <Tab label='Action List' />
          <Tab label='Authorization' />
          <Tab label='Identity Function' />
          <Tab label='Build Function' />
          <Tab label='Action Function' />
          <Tab label='Redirect Function' />
          <Tab label='Webhook Function' />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <BasicInfo appId={appId} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <ActionList appId={appId} />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <AuthorizationTypeSelector appId={appId} />
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <Function appId={appId} functionType={'IDENTITY'} />
        </TabPanel>
        <TabPanel value={tab} index={4}>
          <Function appId={appId} functionType={'BUILD'} />
        </TabPanel>
        <TabPanel value={tab} index={5}>
          <Function appId={appId} functionType={'ACTION'} />
        </TabPanel>
        <TabPanel value={tab} index={6}>
          <Function appId={appId} functionType={'REDIRECT'} />
        </TabPanel>
        <TabPanel value={tab} index={7}>
          <Function appId={appId} functionType={'WEBHOOK'} />
        </TabPanel>
      </Box>
      {docModal}
    </>
  )
  const backButton: CommonAppBarMenu = {
    title: 'BACK',
    onClick: () => {
      navigate('/')
    },
  }
  return (
    <CommonAppBarContainer menus={[backButton, docListButton, logoutButton]}>
      {content}
    </CommonAppBarContainer>
  )
}
