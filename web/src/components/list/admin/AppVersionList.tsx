import { Container, LinearProgress, Stack } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Link } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { AppVerison } from '@src/models/AppVersion'
import { Button } from '@mui/base'
import { useEffect, useState } from 'react'
import { getAppVersionList } from '@src/apis/getAppVersionList'

type Props = {
  appId: string
}

export default function AppVersionList({ appId }: Props) {
  const [appVersions, setAppVersions] = useState<AppVerison[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getAppVersionList(appId).then((versions) => {
      setAppVersions([...versions].reverse())
      setLoading(false)
    })
  }, [appId])

  if (loading) {
    return <LinearProgress />
  }

  if (appVersions.length === 0) {
    return <Container
      sx={{
        marginTop: 2,
      }}
    >
      <Typography variant='h4' component='div' fontWeight={'bold'} gutterBottom>
        No app versions found
      </Typography>
    </Container>
  }
  
  return <Container
    sx={{
      marginTop: 2,
    }}
  >
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
    >
      <Typography
        variant='h4'
        component='div'
        fontWeight={'bold'}
        gutterBottom
      >
        App Versions
      </Typography>
    </Stack>
    <TableContainer
      component={Paper}
      sx={{
        marginTop: 1,
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Label</TableCell>
            <TableCell>Created Time</TableCell>
            <TableCell>&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appVersions.map((row) => (
            <TableRow
              key={row.app_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component='th' scope='row'>
                {row.label}
              </TableCell>
              <TableCell>
                {row.created_time ? new Date(row.created_time).toLocaleString() : ''}
              </TableCell>
              <TableCell>
                <Link to={`/deployPreviousVersion/app/${row.app_id}/version/${row.version_id}`} state={{ versionAppMapping: row }}>
                  <Button color='primary'>
                    Deploy
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Container>
}