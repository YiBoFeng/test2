import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useApp } from '@hooks/useApp'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { App, AppCategory } from '@models/App'
import { getPath } from '@apis/getPath'
import { createAppIcon } from '@apis/createAppIcon'
import { updateAppIcon } from '@apis/updateAppIcon'
import defaultLogo from '@themes/images/defaultLogo.png'
import { UseDialog } from '@components/common/useDialog'
import { publishApp } from '@apis/publishApp'
import { updateAppMultipart } from '@apis/updateApp'
import JSZip from 'jszip'
import { getAppDataForDownload } from '@apis/getApp'
import { FuncTypeSchema } from '@models/Func'
import { getFunctionCode } from '@apis/getFunctionCode'
import { deleteAppIcon } from '@apis/deleteAppIcon'
import { getUserToken } from '@apis/getUserToken'
import { useNavigate } from 'react-router-dom'

type Props = {
  appId: string
}

export function BasicInfo({ appId }: Props) {
  const logoInputRef = useRef<HTMLInputElement | null>(null)
  const [saveButtonLoading, setSaveButtonLoading] = useState(false)
  const [uploadLogoButtonLoading, setUploadLogoButtonLoading] = useState(false)
  const [unsavedApp, setUnsavedApp] = useState<App>()
  const { app, saveApp } = useApp(appId)
  const [isFirstLogoCreation, setIsFirstLogoCreation] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const labelRef = useRef<HTMLInputElement>()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const zipInputRef = useRef<HTMLInputElement>()
  const [_, setZip] = useState<File | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (app) {
      setUnsavedApp(app)
    }
  }, [app])

  // TODO: need enhance
  useEffect(() => {
    getUserToken().then((response) => {
      setAccessToken(response as unknown as string)
    })
  }, [])

  const handleLogoChange = async(e: ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0]
    if (imgFile) {
      changeLogo(imgFile)
    }
  }

  function changeLogo(imgFile: File) {
    if (imgFile) {
      if (imgFile.size > 100 * 1024) {
        alert('Image size should be less than or equal to 100KB')
        if (logoInputRef.current) {
          logoInputRef.current.value = ''
          setUploadLogoButtonLoading(false)
        }
        return
      }
      const fileReader = new FileReader()

      fileReader.addEventListener('load', () => {
        const data = fileReader.result as string
        const base64Index = data.indexOf(';base64,')
        const base64 = data.substring(base64Index + 8)
        const image = new Image()

        image.addEventListener('load', () => {
          const width = image.width
          const height = image.height

          if (width === 128 && height === 128) {
            const img = document.querySelector('img[id="logo"]') as HTMLImageElement
            if (isFirstLogoCreation) {
              createAppIcon(appId, base64).then(() => {
                img.src = data
                setUploadLogoButtonLoading(false)
              }).catch((error) => {
                alert('Failed to create logo ' + JSON.stringify(error))
                setUploadLogoButtonLoading(false)
              })
            } else {
              updateAppIcon(appId, base64).then(() => {
                img.src = data
                setUploadLogoButtonLoading(false)
              }).catch((error) => {
                alert('Failed to update logo ' + JSON.stringify(error))
                setUploadLogoButtonLoading(false)
              })
            }
          } else {
            alert('Image size should be: 128x128 px')
            if (logoInputRef.current) {
              logoInputRef.current.value = ''
              setUploadLogoButtonLoading(false)
            }
          }
        })

        image.src = data
      })

      fileReader.readAsDataURL(imgFile)
    }
  }

  function handlePublishAction() {
    const labelEl = labelRef.current

    if (!labelEl) {
      throw new Error('labelEl is null')
    }
    saveApp(unsavedApp as App).then(() => {
      publishApp(appId, labelEl.value).then(() => {
        setSaveButtonLoading(false)
      }).catch((err) => {
        setSaveButtonLoading(false)
        alert(JSON.stringify(err))
      })
    }).catch((err) => {
      setSaveButtonLoading(false)
      alert(JSON.stringify(err))
    })

  }

  function handleSaveAndPublishApp() {
    setShowPublishDialog(true)
  }

  function handleUpdateApp() {
    (zipInputRef.current as HTMLInputElement).click()
  }

  function handleDownloadApp() {
    const zip = new JSZip()

    getAppDataForDownload(appId).then((data) => {
      if (data.logo.base64?.length > 0) {
        zip.file('logo.png', data.logo.base64, { base64: true })
      }
      delete data.logo

      zip.file('config.json', JSON.stringify(data, null, 2))
      const dataKeys = Object.keys(data)

      const functionTypes = Object.values(FuncTypeSchema.enum)
      const functionPromises = functionTypes.filter((type) => dataKeys.includes(`${type.toLowerCase()}_function`)).map(async(type) => {
        const res = await getFunctionCode(appId, type, '$LATEST')
        zip.file(`FUNCTION_TYPE_${type}.zip`, res.data)
      })

      Promise.all(functionPromises)
        .then(() => {
          zip.generateAsync({ type: 'blob' }).then((content) => {
            const url = URL.createObjectURL(content)
            const link = document.createElement('a')
            link.href = url
            link.download = `${app?.name}.zip`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            setSaveButtonLoading(false)
          })
        })
        .catch((error) => {
          setSaveButtonLoading(false)
          alert('Failed to get function or code: ' + JSON.stringify(error))
        })
    }).catch((err) => {
      setSaveButtonLoading(false)
      console.error('Error downloading app data', err)
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveButtonLoading(true)

    const file = e.target.files?.item(0)
    if (file) {
      setZip(file)
    } else {
      setSaveButtonLoading(false)
      return
    }
    const fileInput = zipInputRef.current as HTMLInputElement

    if (fileInput.files && fileInput.files.length > 0) {
      const zipFile = fileInput.files[0]

      JSZip.loadAsync(zipFile) // Read the ZIP file
        .then((zipObject) => {
          const promises: File[] = []
          Object.keys(zipObject.files).forEach((filename) => {
            const filePromise = zipObject.files[filename].async('blob').then((blob) => {
              return new File([blob], filename, { type: blob.type })
            })
            promises.push(filePromise)
          })

          return Promise.all(promises)
        })
        .then((files) => {
          // files is an array of File objects
          const logoFile = files.find((file) => file.name === 'logo.png')
          if (logoFile) {
            changeLogo(logoFile)
          } else {
            deleteAppIcon(appId).catch((err) => {
              console.error('Error deleting app icon', err)
            })
          }
          updateAppMultipart(appId, files).then(() => {
            setSaveButtonLoading(false)
            window.location.reload()
          }).catch((err) => {
            alert('Failed to create app: ' + JSON.stringify(err))
            console.log(err)
            setSaveButtonLoading(false)
          })
        })
        .catch((err) => {
          console.error('Error unzipping the file:', err)
          setSaveButtonLoading(false)
        })
    } else {
      setSaveButtonLoading(false)
    }
  }

  const handleClosePublishDialog = () => {
    setShowPublishDialog(false)
    setSaveButtonLoading(false)
  }

  const handleViewAppLogs = () => {
    navigate(`/app/${appId}/appLogs`)
  }

  if (!unsavedApp) {
    return <LinearProgress />
  }

  return (
    <Container sx={{ marginTop: 2 }}>
      <Stack spacing={2}>
        <FormControl sx={{ m: 1 }}>
          <div>Logo (Dimensions: 128*128px, Max Size: 100KB)</div>
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
              setIsFirstLogoCreation(true)
            }}
            alt={''}
          />
          <LoadingButton
            sx={{
              marginTop: 2,
              alignSelf: 'flex-start',
            }}
            loading={uploadLogoButtonLoading}
            variant='contained'
            onClick={() => {
              setUploadLogoButtonLoading(true)
              logoInputRef.current?.click()
              setUploadLogoButtonLoading(false)
            }}
          >
            Upload logo
          </LoadingButton>
          <input
            ref={logoInputRef}
            type='file'
            accept='image/*'
            onChange={handleLogoChange}
            hidden={true}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label='Name'
            value={unsavedApp.name}
            onChange={(e) => {
              setUnsavedApp({
                ...unsavedApp,
                name: e.target.value,
              })
            }}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label='Description'
            value={unsavedApp.description}
            onChange={(e) => {
              setUnsavedApp({
                ...unsavedApp,
                description: e.target.value,
              })
            }}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField value={unsavedApp.app_id} label='Application ID' disabled />
        </FormControl>
        <Accordion>
          <AccordionSummary>Advanced</AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={unsavedApp.category}
                  label={'Category'}
                  onChange={(e) => {
                    setUnsavedApp({
                      ...unsavedApp,
                      category: e.target.value as AppCategory,
                    })
                  }}
                >
                  <MenuItem value='APP_CATEGORY_E_SIGNATURE'>E-Signature</MenuItem>
                  <MenuItem value='APP_CATEGORY_FORM'>Form</MenuItem>
                  <MenuItem value='APP_CATEGORY_PAYMENT'>Payment</MenuItem>
                  <MenuItem value='APP_CATEGORY_TIME_BOOKING'>Time Booking</MenuItem>
                  <MenuItem value='APP_CATEGORY_TODO'>To-do</MenuItem>
                  <MenuItem value='APP_CATEGORY_ID_VERIFICATION'>ID Verification</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Box sx={{ height: '1em' }}>
          <input
            ref={zipInputRef}
            type='file'
            accept={'application/zip'}
            onChange={handleFileChange}
            hidden={true}
          />
        </Box>
        <div style={{ marginTop: '1em' }}>
          <LoadingButton
            sx={{
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
          <LoadingButton
            sx={{
              alignSelf: 'flex-start',
              marginLeft: '1em',
            }}
            variant='contained'
            loading={saveButtonLoading}
            onClick={() => {
              setSaveButtonLoading(true)
              handleSaveAndPublishApp()
            }}
          >
            Request review
          </LoadingButton>
          <LoadingButton
            sx={{
              alignSelf: 'flex-start',
              marginLeft: '1em',
            }}
            variant='contained'
            loading={saveButtonLoading}
            onClick={() => {
              handleUpdateApp()
            }}
          >
            Import
          </LoadingButton>
          <LoadingButton
            sx={{
              alignSelf: 'flex-start',
              marginLeft: '1em',
            }}
            variant='contained'
            loading={saveButtonLoading}
            onClick={() => {
              setSaveButtonLoading(true)
              handleDownloadApp()
            }}
          >
            Export
          </LoadingButton>
          <LoadingButton
            sx={{
              alignSelf: 'flex-start',
              marginLeft: '1em',
            }}
            variant='contained'
            loading={saveButtonLoading}
            onClick={() => {
              setSaveButtonLoading(true)
              handleViewAppLogs()
            }}
          >
            Logs
          </LoadingButton>
        </div>
      </Stack>
      <UseDialog title={'Request review'} open={showPublishDialog} handleClose={handleClosePublishDialog} handleConfirm={() => {
        handlePublishAction()
        setShowPublishDialog(false)
      }}>
        <TextField
          margin='dense'
          id='label'
          label='Label'
          type='text'
          fullWidth
          variant='standard'
          inputRef={labelRef}
        />
      </UseDialog>

    </Container>
  )
}
