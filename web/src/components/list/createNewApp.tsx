import { UseDialog } from '../common/useDialog'
import { createApp, createAppMultipart } from '@apis/createApp'
import { TextField, MenuItem, Select, InputLabel, FormControl, Box, LinearProgress } from '@mui/material'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JSZip from 'jszip'
import { createAppIcon } from '@apis/createAppIcon'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function CreateNewApp({ open, setOpen }: Props) {
  const nameRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLInputElement>(null)
  const categoryRef = useRef<HTMLInputElement>(null)
  const zipInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [_, setZip] = useState<File | null>(null)
  const navigate = useNavigate()
  const onImport = () => {
    (zipInputRef.current as HTMLInputElement).click()
  }

  function changeLogo(appId: string, imgFile: File) {
    if (imgFile.size > 100 * 1024) {
      alert('Image size should be less than or equal to 100KB')
      setIsLoading(false)
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
          createAppIcon(appId, base64).then(() => {
            setIsLoading(false)
          }).catch((error) => {
            alert('Failed to create logo: ' + JSON.stringify(error))
            setIsLoading(false)
          })
        } else {
          alert('Image size should be: 128x128 px')
          setIsLoading(false)
        }
      })

      image.src = data
    })

    fileReader.readAsDataURL(imgFile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true)

    const file = e.target.files?.item(0)
    if (file) {
      setZip(file)
    }
    const fileInput = zipInputRef.current as HTMLInputElement

    if (fileInput.files && fileInput.files.length > 0) {
      const zipFile = fileInput.files[0]

      JSZip.loadAsync(zipFile) // Read the ZIP file
        .then((zipObject) => {
          const promises: Promise<File>[] = []
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
          createAppMultipart(files).then((app)=>{
            const logoFile = files.find((file) => file.name === 'logo.png')
            const appId = app.app_id
            if (!appId) {
              throw new Error('app_id is null')
            }
            if (logoFile) {
              changeLogo(appId, logoFile)
            }
            navigate(`/app/${appId}`, { replace: true })
            setIsLoading(false)
            onClose()
          }).catch((err)=>{
            alert('Failed to create app: ' + JSON.stringify(err))
            console.log(err)
            setIsLoading(false)
          })
        })
        .catch((err) => {
          console.error('Error unzipping the file:', err)
          setIsLoading(false)
        })
    }
    else {
      setIsLoading(false)
    }
  }
  const children = isLoading ? (
    <LinearProgress />
  ) : (<div>
    <TextField
      autoFocus
      margin='dense'
      id='name'
      label='Name'
      type='text'
      fullWidth
      variant='standard'
      inputRef={nameRef}
    />
    <TextField
      margin='dense'
      id='description'
      label='Description'
      type='text'
      fullWidth
      variant='standard'
      inputRef={descRef}
    />
    <FormControl fullWidth style={{ marginTop: '16px' }}>
      <InputLabel>Category</InputLabel>
      <Select fullWidth
        label='Category'
        inputRef={categoryRef}
      >
        <MenuItem value='APP_CATEGORY_E_SIGNATURE'>E-Signature</MenuItem>
        <MenuItem value='APP_CATEGORY_FORM'>Form</MenuItem>
        <MenuItem value='APP_CATEGORY_PAYMENT'>Payment</MenuItem>
        <MenuItem value='APP_CATEGORY_TIME_BOOKING'>Time Booking</MenuItem>
        <MenuItem value='APP_CATEGORY_TODO'>To-do</MenuItem>
        <MenuItem value='APP_CATEGORY_ID_VERIFICATION'>ID Verification</MenuItem>
      </Select>
    </FormControl>
    <Box sx={{ height: '1em' }}>
      <input
        ref={zipInputRef}
        type='file'
        accept={'application/zip'}
        onChange={handleFileChange}
        hidden={true}
      />
      {/* {zip && (
        <Typography display={'inline'} variant={'body2'}>
          {zip.name}
        </Typography>
      )} */}
    </Box>
  </div>
  )
  const create = ()=>{
    const nameEl = nameRef.current
    const descEl = descRef.current
    const categoryEl = categoryRef.current
    if (!nameEl || !descEl || !categoryEl) {
      throw new Error('nameEl/descEl/typeEl or categoryEl is null')
    }
    if (!nameEl.value || !categoryEl.value) {
      alert('App and Category are required!')
      return
    }
    createApp(nameEl.value, descEl.value, categoryEl.value).then((app)=>{
      navigate(`/app/${app.app_id}`, { replace: true })
      onClose()
    }).catch((err)=>{
      alert('Failed to create app: ' + JSON.stringify(err))
      console.log(err)
    })
  }
  const onClose = ()=>{
    setOpen(false)
  }
  return <UseDialog title={'Create a new application'} open={open} handleClose={onClose} handleConfirm={()=>{
    create()
  }} buttonLoading={isLoading} handleImport={onImport} haveImportButton={true}>
    {children}
  </UseDialog>
}