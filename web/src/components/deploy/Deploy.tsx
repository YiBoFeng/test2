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
import { LoadingButton } from '@mui/lab'
import { getPath } from '@apis/getPath'
import defaultLogo from '@themes/images/defaultLogo.png'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getNodes } from '@apis/getNodes'
import { IntegrationNode } from '@models/IntegrationNode'
import { resolveApp } from '@apis/resolveApp'
import { useAppVersion } from '@hooks/admin/useAppVersion'
import { getUserToken } from '@apis/getUserToken'

type Props = {
  appId: string
}

export default function Deploy({ appId }: Props) {
  const { app, version, deployAppVersion } = useAppVersion(appId)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [allNodes, setAllNodes] = useState<IntegrationNode[]>([])
  const [loadingState, setLoadingState] = useState<string[]>([])
  const [buttonLoading, setButtonLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getNodes(), getUserToken()]).then(([nodes, token]) => {
      setAllNodes(nodes)
      setAccessToken(token as unknown as string)
    })
  }, [])

  useEffect(() => {
    setButtonLoading(loadingState.length > 0)
  }, [loadingState])
  
  if (!app || !version || !allNodes) {
    return <LinearProgress />
  }

  return (
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
        <FormControl fullWidth>
          <Stack direction='row' spacing={2} alignItems='center'>
            <Typography variant='h6'>Deploy label:</Typography>
            <Typography variant='body1'>{version.label}</Typography>
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
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allNodes && allNodes.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{
                    height: '70px',
                  }}>
                  <TableCell component='th' scope='row'>
                    {row.name}
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    {version.nodes && version.nodes.some((node) => node.node_id === row.node_id) ? 'Deployed' : 'Not Deployed'}
                  </TableCell>
                  <TableCell>
                    {!(version.nodes && version.nodes.some((node) => node.node_id === row.node_id)) && row.node_id && (
                      <LoadingButton
                        sx={{
                          alignSelf: 'flex-start',
                        }}
                        variant='contained'
                        loading={loadingState.includes(row.node_id)}
                        onClick={() => {
                          if (!version.version_id || !row.node_id) {
                            return
                          }
                          setLoadingState((prevState) => [...prevState, row.node_id].filter((id) => id !== undefined) as string[])
                          deployAppVersion(row.node_id)?.finally(() => {
                            setLoadingState((prevState) => prevState.filter((id) => id !== row.node_id))
                          })
                        }}
                      >
                        Deploy
                      </LoadingButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ marginTop: '1em' }}>
          <LoadingButton
            sx={{
              alignSelf: 'flex-start',
            }}
            variant='contained'
            loading={buttonLoading}
            onClick={() => {
              navigate('/', { replace: true })
            }}
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            sx={{
              alignSelf: 'flex-start',
              marginLeft: '1em',
            }}
            variant='contained'
            loading={buttonLoading}
            onClick={() => {
              if (version && version.version_id) {
                setButtonLoading(true)
                resolveApp(appId, version.version_id).then(() => {
                  navigate('/', { replace: true })
                  setButtonLoading(false)
                }).catch(() => {
                  alert('Failed to resolve')
                  setButtonLoading(false)
                })
              }
            }}
          >
            Resolve
          </LoadingButton>
        </div>
      </Stack>
    </Container>
  )
}
