import {
  Container,
  FormControl,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { getPath } from '@apis/getPath'
import defaultLogo from '@themes/images/defaultLogo.png'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUserToken } from '@apis/getUserToken'
import { CommonAppBarContainer, CommonAppBarMenu } from '../../common/CommonAppBarContainer'
import useLogout from '@src/hooks/useLogout'
import { useApp } from '@src/hooks/admin/useApp'
import LoadingButton from '@mui/lab/LoadingButton'
import { deleteApp } from '@src/apis/admin/deleteApp'
import { useAppNodeVersionMap } from '@src/hooks/admin/useAppNodeVersionMap'

export default function AppStatusDashboard() {
  const params = useParams()
  const appId = params['appId'] as string
  const { app } = useApp(appId)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [buttonLoading, setButtonLoading] = useState(false)
  const { allNodes, nodeAppVersionMap } = useAppNodeVersionMap(appId)
  const navigate = useNavigate()
  const { logoutButton } = useLogout()

  useEffect(() => {
    getUserToken().then((response) => {
      setAccessToken(response as unknown as string)
    })

  }, [app, appId])
  
  if (!app || !allNodes || !accessToken || !(nodeAppVersionMap.size > 0)) {
    return <LinearProgress />
  }

  const content = (
    <Container sx={{ marginTop: 2 }}>
      <Stack spacing={2}>
        <FormControl sx={{ m: 1 }}>
          <img
            width={128}
            height={128}
            id='logo'
            src={
              accessToken
                ? `${getPath()}/framework/v1/apps/${appId}/logo?access_token=${accessToken}`
                : undefined
            }
            onError={(e) => {
              const imageElement = e.target as HTMLImageElement
              imageElement.src = defaultLogo
            }}
            alt={''}
          />
        </FormControl>
        <FormControl fullWidth>
          <Stack direction='row' spacing={2} alignItems='center'>
            <Typography variant='h6'>App Name:</Typography>
            <Typography variant='body1'>{app.name}</Typography>
          </Stack>
        </FormControl>
        <TableContainer
          component={Paper}
          sx={{
            marginTop: 1,
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow 
                sx={{
                  height: '60px',
                }}>
                <TableCell>Node Name</TableCell>
                <TableCell>Deploy Status</TableCell>
                <TableCell>Label</TableCell>
                <TableCell>&nbsp;</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allNodes && allNodes.map((node) => (
                <TableRow
                  key={node.name}
                  sx={{
                    height: '70px',
                  }}>
                  <TableCell component='th' scope='row'>
                    {node.name}
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    {nodeAppVersionMap.get(node) ? 'Deployed' : 'Not Deployed'}
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    {nodeAppVersionMap.get(node)?.label}
                  </TableCell>
                  <TableCell>
                    <LoadingButton
                      loading={buttonLoading}
                      disabled={!nodeAppVersionMap.get(node)}
                      sx={{
                        alignSelf: 'flex-start',
                      }}
                      variant='contained'
                      onClick={() => {
                        const version_id = nodeAppVersionMap.get(node)?.version_id
                        if (!version_id) {
                          alert('No version id')
                          return
                        }
                        setButtonLoading(true)
                        deleteApp(node.node_id!, appId, version_id).then(() => {
                          nodeAppVersionMap.delete(node)
                          alert('UnDeploy success!')
                          setButtonLoading(false)
                        }).catch(() => {
                          alert('UnDeploy failed!')
                          setButtonLoading(false)
                        })
                      }}
                    >
                      UnDeploy
                    </LoadingButton>
                  </TableCell>
                  <TableCell>
                    <LoadingButton
                      loading={buttonLoading}
                      disabled={!nodeAppVersionMap.get(node)}
                      sx={{
                        alignSelf: 'flex-start',
                      }}
                      variant='contained'
                      onClick={() => {
                        navigate(`/deploy/appLogs/${appId}/node/${node.node_id}`)
                      }}
                    >
                      Get Logs
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
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

