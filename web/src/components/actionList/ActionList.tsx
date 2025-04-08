import { Box, Button, Grid, TextField, LinearProgress, Container, MenuItem } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/ClearOutlined'
import { useApp } from '@hooks/useApp'
import { useEffect, useState } from 'react'
import { App, AppActionType, appActionTypeLabel, AppActionTypeSchema } from '@models/App'
import React from 'react'

type Props = {
  appId: string
}

export default function ActionList({ appId }: Props) {
  const [saveButtonLoading, setSaveButtonLoading] = useState(false)
  const [unsavedApp, setUnsavedApp] = useState<App>()
  const { app, saveApp } = useApp(appId)

  useEffect(() => {
    if (app) {
      setUnsavedApp(app)
    }
  }, [app])

  if (!unsavedApp) {
    return <LinearProgress />
  }

  return (
    <Container sx={{ marginTop: 2 }}>
      <Box>
        <Grid container spacing={1} alignItems={'center'}>
          {
            unsavedApp.actions.map((action, index) => {
              return (
                <React.Fragment key={index}>
                  <Grid item xs={2}>
                    <TextField
                      label='Type'
                      select
                      fullWidth
                      value={action.type}
                      onChange={(e) => {
                        const type = e.target.value as AppActionType
                        setUnsavedApp({
                          ...unsavedApp,
                          actions: unsavedApp.actions.map((action, i) =>
                            i === index ? { ...action, type: type } : action,
                          ),
                        })
                      }}
                    >
                      {
                        AppActionTypeSchema.options.map((option) => {
                          return (
                            <MenuItem key={option} value={option}>
                              {appActionTypeLabel(option)}
                            </MenuItem>
                          )
                        })
                      }
                    </TextField>
                  </Grid>
                  <Grid item xs={4.5}>
                    <TextField
                      fullWidth
                      label='Key'
                      value={action.key}
                      onChange={(e) => {
                        setUnsavedApp({
                          ...unsavedApp,
                          actions: unsavedApp.actions.map((action, i) =>
                            i === index ? { ...action, key: e.target.value } : action,
                          ),
                        })
                      }}
                    />
                  </Grid>
                  <Grid item xs={4.5}>
                    <TextField
                      fullWidth
                      label='Title'
                      value={action.title}
                      onChange={(e) => {
                        setUnsavedApp({
                          ...unsavedApp,
                          actions: unsavedApp.actions.map((action, i) =>
                            i === index ? { ...action, title: e.target.value } : action,
                          ),
                        })
                      }}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button onClick={() => {
                      setUnsavedApp({
                        ...unsavedApp,
                        actions: unsavedApp.actions.filter((_, i) => i !== index),
                      })
                    }}>
                      <RemoveIcon color='error' />
                    </Button>
                  </Grid>
                </React.Fragment>
              )
            })
          }
          <Grid item xs={12}>
            <Button
              fullWidth
              variant='outlined'
              onClick={() => {
                setUnsavedApp({
                  ...unsavedApp,
                  actions: [
                    ...unsavedApp.actions,
                    { key: '', title: '' },
                  ],
                })
              }}
            >
              <AddIcon></AddIcon>
            </Button>
          </Grid>
        </Grid>
        <LoadingButton
          sx={{
            marginTop: 2,
            alignSelf: 'flex-start',
          }}
          variant='contained'
          loading={saveButtonLoading}
          onClick={() => {
            setSaveButtonLoading(true)
            saveApp(unsavedApp).then(() => {
              setSaveButtonLoading(false)
            })
          }}
        >
          Save
        </LoadingButton>
      </Box>
    </Container>
  )
}