import {
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { RedirectUrl, getRedirectUrl } from '@apis/getRedirectURL'

type Props = {
  appId: string
}

export function OAuthRedirectURL({ appId }: Props) {
  const [redirectUrl, setRedirectUrl] = useState<RedirectUrl | undefined>()

  useEffect(() => {
    getRedirectUrl(appId, 'oauth1').then((redirectUrl) => {
      setRedirectUrl(redirectUrl)
    }).catch((e) => {
      console.error(e)
    })
  }, [appId])

  return (
    <Stack spacing={1}>
      <Typography variant='body2' gutterBottom>
        Copy Moxo&apos;s OAuth Redirect URL below, and add it to the allowed
        list in your app&apos;s admin console if needed.
      </Typography>
      <TextField
        disabled
        label='Redirect URL in production'
        value={
          redirectUrl?.production ?? 'Loading...'
        }
      />
      <TextField
        disabled
        label='Redirect URL in sandbox'
        value={
          redirectUrl?.sandbox ?? 'Loading...'
        }
      />
    </Stack>
  )
}
