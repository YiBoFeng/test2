import { LoadingButton } from '@mui/lab'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, LinearProgress, Stack, TextField, Tooltip, Typography, useEventCallback } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { testFunction } from '@apis/testFunction'
import { testApp } from '@apis/testApp'
import Console from './Console'
import { CodeEditor } from '../common/CodeEditor'
import { useAuthConfig } from '@hooks/useAuthConfig'
import { FuncType } from '@models/Func'
import { CustomAuthConfig } from '@models/AuthConfig'

type Props = {
  appId: string
  functionType: FuncType
  saveFn: () => Promise<unknown>
}

export default function APIDebugPanel({
  appId,
  functionType,
  saveFn,
}: Props) {
  const [payload, setPayload] = useState(
    '{"input":{"input1": "value1", "input2": "value2"},"context":{"action_key": "key1", "title": "context title", "description": "context description"}}',
  )
  const [webhookURL, setWebhookURL] = useState('')
  const [redirectURL, setRedirectURL] = useState('')
  const [output, setOutput] = useState('Output will display here.')
  const [log, setLog] = useState('Logs will display here.')
  const [schemaError, setSchemaError] = useState('Schema verification result will display here.')
  const [payloadValid, setPayloadValid] = useState(true)
  const [testing, setTesting] = useState(false)
  const [customAuthDialogOpen, setCustomAuthDialogOpen] = useState(false)
  const { authConfig } = useAuthConfig(appId)
  const customAuthPromiseResolverRef = useRef<((credential: object) => void)>()

  useEffect(() => {
    const storedPayload = localStorage.getItem(`${appId}-${functionType}-payload`)
    if (storedPayload) {
      setPayload(JSON.parse(storedPayload))
    }
    const storedWebhookURL = localStorage.getItem(`${appId}-${functionType}-webhookURL`)
    if (storedWebhookURL) {
      setWebhookURL(storedWebhookURL)
    }
    const storedRedirectURL = localStorage.getItem(`${appId}-${functionType}-redirectURL`)
    if (storedRedirectURL) {
      setRedirectURL(storedRedirectURL)
    }
  }, [appId, functionType])

  const handleClickTest = useEventCallback(() => {
    localStorage.setItem(`${appId}-${functionType}-payload`, JSON.stringify(payload))
    localStorage.setItem(`${appId}-${functionType}-webhookURL`, webhookURL)
    localStorage.setItem(`${appId}-${functionType}-redirectURL`, redirectURL)
    setTesting(true)
    setOutput('')
    setLog('')
    setSchemaError('')
    saveFn().then(() => {
      if (!authConfig) {
        throw new Error('Can not get auth config.')
      } else {
        return authConfig
      }
    }).then((authConfig) => {
      if (authConfig.oauth1 || authConfig.oauth2) {
        return testApp(appId, authConfig.oauth1 ? 'oauth1' : 'oauth2')
      } else if (authConfig.custom) {
        return new Promise<object>((resolve, _) => {
          customAuthPromiseResolverRef.current = resolve
          setCustomAuthDialogOpen(true)
        })
      }
    }).then((credential) => {
      return testFunction(
        appId,
        functionType,
        payload,
        webhookURL,
        redirectURL,
        credential,
      )
    }).then((data) => {
      setTesting(false)
      const dataObject = data as unknown as { output: object, log: string, schemaValid: boolean, schemaError: string }
      const output = JSON.stringify(dataObject.output)
      const log = dataObject.log
      const schemaValid = dataObject.schemaValid
      const schemaError = dataObject.schemaError
      if (!output && !log) {
        setOutput(`Debug response is invalid: ${data}`)
      } else {
        setOutput(output)
        setLog(log)
      }

      if (!schemaValid) {
        setSchemaError(schemaError)
      } else {
        setSchemaError('Schema valid successfully!')
      }
    }).catch((error) => {
      setTesting(false)
      setOutput(error.toString())
    })
  })

  if (!authConfig) {
    return <LinearProgress />
  }

  return (
    <>
      {authConfig.custom && (
        <CustomAuthDialog
          open={customAuthDialogOpen}
          config={authConfig.custom as CustomAuthConfig}
          onSubmit={(credential) => {
            setCustomAuthDialogOpen(false)
            customAuthPromiseResolverRef.current?.({ custom: credential })
          }}
          onCancel={() => {
            setTesting(false)
            setCustomAuthDialogOpen(false)
          }}
        />
      )
      }
      <Grid container spacing={2}>
        {functionType === 'ACTION' && (
          <>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  label='WEBHOOK URL'
                  value={webhookURL}
                  onChange={(e) => {
                    setWebhookURL(e.target.value)
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  label='REDIRECT URL'
                  value={redirectURL}
                  onChange={(e) => {
                    setRedirectURL(e.target.value)
                  }}
                />
              </FormControl>
            </Grid>
          </>
        )}
        <Grid item xs={6}>
          <Box sx={{ height: '12em', border: 1, borderColor: 'lightgray' }}>
            <CodeEditor
              readOnly={false}
              language={'json'}
              code={payload}
              showLineNumbers={false}
              onChange={(value) => setPayload(value ? value : '')}
              onValidate={(valid) => setPayloadValid(valid)}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Console variant={'darken'}>{output}</Console>
        </Grid>
        <Grid item xs={12}>
          <Console variant={'dark'}>{log}</Console>
        </Grid>
        <Grid item xs={12}>
          <Console variant={'dark'}>{schemaError}</Console>
        </Grid>
        <Grid item xs={12}>
          <Stack direction={'row'} spacing={1}>
            <LoadingButton
              variant={'contained'}
              disabled={!payloadValid}
              loading={testing}
              onClick={handleClickTest}
            >
            Save And Test
            </LoadingButton>
          </Stack>
        </Grid>
        {!payloadValid && (
          <Grid item xs={12}>
            <Typography color={'red'}>
            Make sure the payload JSON is valid
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  )
}

type CustomAuthDialogProps = {
  config: CustomAuthConfig
  open: boolean
  onSubmit: (credential: object) => void
  onCancel: () => void
}

function CustomAuthDialog({ config, open, onSubmit, onCancel: onClose }: CustomAuthDialogProps) {
  const [credential, setCredential] = useState<{[key: string]: string}>({})
  return (
    <Dialog maxWidth={'md'} fullWidth open={open} onClose={(_, reason) => {
      // disable closing by clicking backdrop or pressing escape key
      if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
        return
      }
      onClose()
    }}>
      <DialogTitle>Authentication</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ my: 1 }}>
          {
            config.inputs.map((input) => {
              return (
                <Tooltip title={input.tip} key={input.key}>
                  <TextField
                    label={input.label}
                    value={credential[input.key]}
                    onChange={(e) => {
                      setCredential({
                        ...credential,
                        [input.key]: e.target.value,
                      })
                    }}
                  />
                </Tooltip>
              )
            })
          }
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => {
          onSubmit(credential)
        }}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}
