import { TextField, Typography, Link, Stack } from '@mui/material'
import NameValuePairs from '../../common/NameValuePairs'
import { useState } from 'react'
import { getAuthURL } from '@apis/getAuthURL'
import { useEffect } from 'react'
import { OAuth1RequestConfig } from '@models/AuthConfig'

type Props = {
  appId: string
  value: OAuth1RequestConfig
  onChange: (value: OAuth1RequestConfig) => void
}

export function OAuthAuthorization({
  appId,
  value,
  onChange,
}: Props) {
  const [authUrl, setAuthUrl] = useState('')
  useEffect(() => {
    getAuthURL(appId, true, 'oauth1', (url) => {
      setAuthUrl(url)
    })
  }, [appId])
  return <Stack spacing={1}>
    <Typography variant='body2' gutterBottom>
      Specify where to send users to authenticate with your API.
    </Typography>
    <TextField
      value={value.url}
      label='Endpoint'
      onChange={(e) => {
        onChange({
          ...value,
          url: e.target.value,
        })
      }}
    />
    <NameValuePairs
      pairs={value.queries}
      onChange={(e) => {
        onChange({
          ...value,
          queries: e,
        })
      }}
      valueOptionsProvider={(k) => {
        if (k === 'oauth_token') {
          return ['{{oauth_token}}']
        }
        return ['oauth_token'].map((v) => `{{${v}}}`)
      }}
    />
    <Typography variant='body1' fontWeight={'bolder'} gutterBottom>
      Authorization URL
    </Typography>
    <Link href={authUrl}>
      <Typography variant='body2' gutterBottom>
        {authUrl}
      </Typography>
    </Link>
  </Stack>
}