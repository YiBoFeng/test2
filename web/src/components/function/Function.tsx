import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { getFunctionCode } from '@apis/getFunctionCode'
import APIDebugPanel from './APIDebugPanel'
import { APILogPanel } from './APILogPanel'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { CodeEditor } from '../common/CodeEditor'
import LoadingButton from '@mui/lab/LoadingButton'
import { useFunction } from '@hooks/useFunction'
import { Func, FuncType } from '@models/Func'
import JSZip from 'jszip'

type Props = {
  appId: string
  functionType: FuncType
}

export default function Function({ appId, functionType }: Props) {
  const { func, code, codeZip, saveFunc, isCodeLoading } = useFunction(appId, functionType)
  const [unsavedFunc, setUnsavedFunc] = useState<Func>()
  const [unsavedCode, setUnsavedCode] = useState<string>()
  const [saveButtonLoading, setSaveButtonLoading] = useState(false)
  const [downloadButtonLoading, setDownloadButtonLoading] = useState(false)
  const zipInputRef = useRef<HTMLInputElement>(null)
  const [zip, setZip] = useState<File | null>(null)
  const [isViewType] = useState(false)

  useEffect(() => {
    if (func) {
      if (Object.keys(func).length > 0) {
        setUnsavedFunc(func)
      } else {
        setUnsavedFunc(defaultFunc)
      }
    }
  }, [func])

  useEffect(() => {
    if (zipInputRef.current?.files?.length) {
      setZip(zipInputRef.current.files[0])
    } else {
      setZip(codeZip)
    }
  }, [zipInputRef, codeZip])

  useEffect(() => {
    setUnsavedCode(code)
  }, [code])

  if (!unsavedFunc) {
    return <LinearProgress />
  }

  const byZip = unsavedFunc.by_zip == undefined ? false : unsavedFunc.by_zip
  const showsSwitch = functionType === 'REDIRECT' || functionType === 'WEBHOOK'
  const enabled = Object.keys(unsavedFunc).length !== 0 || !showsSwitch

  function handleSwitchChange(_event: unknown, checked: boolean) {
    if (!checked) {
      if (!func) {
        setUnsavedFunc({})
        return
      }
      const confirmed = window.confirm(
        'Are you sure you want to disable this function? You function data will be deleted!',
      )
      if (confirmed) {
        saveFunc({})
      }
    } else {
      setUnsavedFunc({ by_zip: false })
    }
  }

  function handleSaveFunction() {
    if (!unsavedFunc) {
      throw new Error('Function is not initialized!')
    } else if (code === '' && !byZip) {
      throw new Error('Please input your code!')
    } else if (zip === undefined && byZip) {
      throw new Error('Please upload a zip file!')
    }
    
    return new Promise<Blob>((resolve) => {
      const zipFile = zip
      if (zipFile && byZip) {
        resolve(zipFile)
      } else {
        const newZip = new JSZip()
        newZip.file('index.js', unsavedCode)
        resolve(newZip.generateAsync({ type: 'blob' }))
      }
    }).then((zipFile) => {
      return saveFunc(unsavedFunc, zipFile)
    })
  }

  function handleDownloadZip() {
    setDownloadButtonLoading(true)
    getFunctionCode(appId, functionType, '$LATEST')
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'function.zip')
        document.body.appendChild(link)
        link.click()
        setDownloadButtonLoading(false)
      })
      .catch(() => {
        setDownloadButtonLoading(false)
      })
  }

  return (
    <Container>
      {
        showsSwitch && (
          <FormControlLabel
            control={<Switch onChange={handleSwitchChange} checked={enabled} />}
            label='Enable'
          />
        )
      }
      {
        enabled ? (
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControl>
              <InputLabel id='configurationMode'>Configuration Mode</InputLabel>
              <Select
                labelId='configurationMode'
                value={byZip.toString()}
                label='Configuration Mode'
                onChange={(e) => {
                  setUnsavedFunc({
                    ...unsavedFunc,
                    by_zip: e.target.value === 'true',
                  })
                }}
              >
                <MenuItem value={'false'}>Code</MenuItem>
                <MenuItem value={'true'}>Zip File</MenuItem>
              </Select>
            </FormControl>
            {!byZip ? (
              <Paper sx={{ height: '20em' }}>
                {
                  !unsavedCode || isCodeLoading ? (
                    <Box position={'relative'}>
                      <Stack
                        spacing={'0.5em'}
                        sx={{ padding: 1 }}
                        alignItems={'flex-start'}
                      >
                        {[
                          '60%',
                          '70%',
                          '50%',
                          '20%',
                          '30%',
                          '50%',
                          '40%',
                          '20%',
                          '30%',
                          '80%',
                          '10%',
                        ].map((width, index) => (
                          <Skeleton key={index}
                            variant='rectangular'
                            width={width}
                            height={'1em'}
                          />
                        ))}
                      </Stack>
                      <Typography
                        variant='subtitle1'
                        sx={{
                          position: 'absolute',
                          top: '0.5em',
                          right: '2em',
                        }}
                      >
                    Loading code...
                      </Typography>
                    </Box>
                  ) : (
                    <CodeEditor
                      readOnly={isViewType}
                      language={'javascript'}
                      code={unsavedCode}
                      onChange={(code) => {
                        setUnsavedCode(code)
                      }}
                    />
                  )
                }
              </Paper>
            ) : (
              <Box sx={{ height: '5em' }}>
                <Button
                  onClick={() => {
                    (zipInputRef.current as HTMLInputElement).click()
                  }}
                >
                Upload a zip File
                </Button>
                {func ? (
                  <LoadingButton
                    loading={downloadButtonLoading}
                    onClick={handleDownloadZip}
                  >
                  Download Zip
                  </LoadingButton>
                ) : null}
                <input
                  ref={zipInputRef}
                  type='file'
                  accept={'application/zip'}
                  onChange={(e) => {
                    const zip = e.target.files?.item(0)
                    if (zip) {
                      setZip(zip)
                    }
                  }}
                  hidden={true}
                />
                {zip && (
                  <Typography display={'inline'} variant={'body2'}>
                    {zip.name}
                  </Typography>
                )}
              </Box>
            )}
            {!isViewType ? (
              <div>
                <Paper>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography fontWeight={'bolder'}>Test panel</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <APIDebugPanel
                        appId={appId}
                        functionType={functionType}
                        saveFn={handleSaveFunction}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Paper>
                <Paper sx={{ marginTop: '1em' }}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography fontWeight={'bolder'}>Log panel</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <APILogPanel
                        appId={appId}
                        functionType={functionType}
                        onClose={handleSaveFunction}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Paper>
                <div style={{ marginTop: '1em' }}>
                  <LoadingButton
                    loading={saveButtonLoading}
                    variant='contained'
                    onClick={() => {
                      setSaveButtonLoading(true)
                      handleSaveFunction()
                        .then((_) => {
                          setSaveButtonLoading(false)
                        })
                        .catch((err) => {
                          setSaveButtonLoading(false)
                          alert(JSON.stringify(err))
                        })
                    }}
                  >
                  Save
                  </LoadingButton>
                </div>
              </div>
            ) : null}
          </Stack>
        ) : null}
    </Container>

  )
}

const defaultFunc: Func = {
  by_zip: false,
}