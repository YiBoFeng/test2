import { useEffect, useState } from 'react'
import { Button, Container, FormControl, IconButton, InputLabel, LinearProgress, MenuItem, Select, Stack } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Link } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { getAppList } from '@apis/getAppList'
import { deleteApp } from '@apis/deleteApp'
import { CommonAppBarContainer } from '../common/CommonAppBarContainer'
import useDoc from '@hooks/useDoc'
import useLogout from '@hooks/useLogout'
import { App, AppCategory, AppCategorySchema } from '@models/App'
import { CreateNewApp } from './createNewApp'
import defaultLogo from '@themes/images/defaultLogo.png'
import { getPath } from '@apis/getPath.ts'
import { getUserToken } from '@apis/getUserToken.ts'

export default function AppList() {
  const [allApps, setAllApps] = useState<App[]>([])
  const [filteredApps, setFilteredApps] = useState<App[]>([])
  const [newModalOpen, setNewModalOpen] = useState(false)
  const [reloadCount, setReloadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const { docListButton, docModal } = useDoc()
  const { logoutButton } = useLogout()
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    getAppList()
      .then((data) => {
        setAllApps(data)
        setIsLoading(false)
      })
      .catch((_) => {
        setIsLoading(false)
      })
  }, [reloadCount])

  useEffect(() => {
    setFilteredApps(allApps.filter((app) => {
      return (selectedCategory === 'ALL' || app.category == selectedCategory)
    }))
  }, [allApps, selectedCategory])

  // TODO: need enhance
  useEffect(() => {
    getUserToken().then((response) => {
      setAccessToken(response as unknown as string)
    })
  }, [])

  const content = isLoading ? (
    <LinearProgress />
  ) : (
    <>
      <Container
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
            Your Moxo Integrations
          </Typography>
          <Stack
            direction={'row'}
            spacing={2}
            alignItems='center'
          >
            <Button
              variant='contained'
              onClick={() => {
                setNewModalOpen(true)
              }}
            >
              Create
            </Button>
            <FormControl sx={{ minWidth: '100px' }}>
              <InputLabel>Category</InputLabel>
              <Select
                label='Category'
                autoWidth
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <MenuItem value='ALL'>ALL</MenuItem>
                {
                  AppCategorySchema.options.map((option) => {
                    return (
                      <MenuItem key={option} value={option}>
                        {appCategoryLabel(option)}
                      </MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </Stack>
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
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApps.map((row) => (
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
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{appCategoryLabel(row.category)}</TableCell>
                  <TableCell>
                    <Link to={`/app/${row.app_id}`}>
                      <IconButton>
                        <EditIcon fontSize='inherit' />
                      </IconButton>
                    </Link>
                    <IconButton
                      onClick={() => {
                        if (confirm('Delete app!')) {
                          deleteApp(row.app_id as string).then(() => {
                            setReloadCount((prevCount) => prevCount + 1)
                          })
                        }
                      }}
                    >
                      <DeleteIcon fontSize='inherit' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CreateNewApp open={newModalOpen} setOpen={setNewModalOpen} />
      </Container>
      {docModal}
    </>
  )

  return (
    <CommonAppBarContainer menus={[docListButton, logoutButton]}>
      {content}
    </CommonAppBarContainer>
  )
}

function appCategoryLabel(category?: AppCategory) {
  switch (category) {
  case 'APP_CATEGORY_E_SIGNATURE':
    return 'E-Signature'
  case 'APP_CATEGORY_FORM':
    return 'Form'
  case 'APP_CATEGORY_PAYMENT':
    return 'Payment'
  case 'APP_CATEGORY_TIME_BOOKING':
    return 'Time Booking'
  case 'APP_CATEGORY_TODO':
    return 'To-do'
  default:
    return 'N/A'
  }
}
