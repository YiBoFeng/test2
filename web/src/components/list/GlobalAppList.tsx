
import { Container, Stack } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Link } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import defaultLogo from '@themes/images/defaultLogo.png'
import { getPath } from '@apis/getPath.ts'
import { App } from '@src/models/App'
import { Button } from '@mui/base'

type Props = {
  matchedApps: App[]
  accessToken: string | null
}

export default function GlobalAppList({ matchedApps, accessToken }: Props) {

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
        Sandbox Apps
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
            <TableCell>Icon</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>&nbsp;</TableCell>
            <TableCell>&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {matchedApps.map((row) => (
            <TableRow
              key={row.app_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <img
                  width={64}
                  height={64}
                  src={
                    accessToken
                      ? `${getPath()}/framework/v1/apps/${row.app_id}/logo?access_token=${accessToken}`
                      : defaultLogo
                  }
                  onError={(e) => {
                    const imageElement = e.target as HTMLImageElement
                    imageElement.src = defaultLogo
                  }}
                />
              </TableCell>
              <TableCell component='th' scope='row'>
                {row.name}
              </TableCell>
              <TableCell>
                <Link to={`/deploy/appVersions/${row.app_id}`}>
                  <Button color='primary'>
                    All Versions
                  </Button>
                </Link>
              </TableCell>
              <TableCell>
                <Link to={`/deploy/appStatus/${row.app_id}`} state={{ versionAppMapping: row }}>
                  <Button color='primary'>
                    Status
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