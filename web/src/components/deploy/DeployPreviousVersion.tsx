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
import { getUserToken } from '@apis/getUserToken'
import { useAppNodeVersionMap } from '@src/hooks/admin/useAppNodeVersionMap'
import { useApp } from '@src/hooks/admin/useApp'
import { getAppVersionList } from '@src/apis/getAppVersionList'
import { AppVerison } from '@src/models/AppVersion'

type Props = {
  appId: string
  versionId: string
}

export default function DeployPreviousVersion({ appId, versionId }: Props) {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loadingState, setLoadingState] = useState<string[]>([])
  const [buttonLoading, setButtonLoading] = useState(false)
  const navigate = useNavigate()
  const { allNodes, nodeAppVersionMap, deployAppVersion } = useAppNodeVersionMap(appId)
  const { app } = useApp(appId)
  const [appVersion, setAppVersion] = useState<AppVerison>()
  useEffect(() => {
    Promise.all([getAppVersionList(appId), getUserToken()]).then(([versions, token]) => {
      setAppVersion(versions.find((version) => version.version_id === versionId))
      setAccessToken(token as unknown as string)
    })
  }, [appId, versionId])

  useEffect(() => {
    setButtonLoading(loadingState.length > 0)
  }, [loadingState])
  
  if (!app || !allNodes || !(nodeAppVersionMap.size > 0) || !appVersion) {
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
            <Typography variant='body1'>{appVersion?.label}</Typography>
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
                    {(nodeAppVersionMap.get(row)?.version_id === versionId) ? appVersion?.label : 'Not Deployed'}
                  </TableCell>
                  <TableCell>
                    {!(nodeAppVersionMap.get(row)?.version_id === versionId) && row.node_id && (
                      <LoadingButton
                        sx={{
                          alignSelf: 'flex-start',
                        }}
                        variant='contained'
                        loading={loadingState.includes(row.node_id)}
                        onClick={() => {
                          if (!versionId || !row.node_id) {
                            return
                          }
                          setLoadingState((prevState) => [...prevState, row.node_id].filter((id) => id !== undefined) as string[])
                          deployAppVersion(row.node_id, appVersion as AppVerison)?.finally(() => {
                            setLoadingState((prevState) => prevState.filter((id) => id !== row.node_id))
                          })
                          // deployApp(appId, versionId, row.node_id).finally(() => {
                          //   setLoadingState((prevState) => prevState.filter((id) => id !== row.node_id))
                          //   setNeedRefresh(true)
                          // })
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
              navigate(`/deploy/appVersions/${appId}`)
            }}
          >
            Cancel
          </LoadingButton>
          {/* <LoadingButton
            sx={{
              alignSelf: 'flex-start',
              marginLeft: '1em',
            }}
            variant='contained'
            loading={buttonLoading}
            onClick={() => {
              if (versionId) {
                setButtonLoading(true)
                resolveApp(appId, versionId).then(() => {
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
          </LoadingButton> */}
        </div>
      </Stack>
    </Container>
  )
}
