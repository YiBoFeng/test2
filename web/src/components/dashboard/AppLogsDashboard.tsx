
import { Box } from '@mui/material'
import { CommonAppBarContainer, CommonAppBarMenu } from '@components/common/CommonAppBarContainer'
import { useNavigate, useParams } from 'react-router-dom'
import useLogout from '@hooks/useLogout'
import { APILogPanel } from '@components/function/APILogPanel'

export default function AppLogsDashboard() {
  const { logoutButton } = useLogout()
  const navigate = useNavigate()
  const params = useParams()
  const appId = params['appId'] as string

  const content = (
    <>
      <Box>
        <div style={{ marginTop: '1em' }}></div>
        <APILogPanel appId={appId} functionType={'ALL'} />
      </Box>
    </>
  )
  const backButton: CommonAppBarMenu = {
    title: 'BACK',
    onClick: () => {
      navigate(`/app/${appId}`)
    },
  }
  return (
    <CommonAppBarContainer menus={[backButton, logoutButton]}>
      {content}
    </CommonAppBarContainer>
  )
}
