import { TextField, Typography, Link, Stack } from '@mui/material'
import NameValuePairs from '../../common/NameValuePairs'
import { useState } from 'react'
import { getAuthURL } from '@apis/getAuthURL'
import { useEffect } from 'react'
import { OAuth2RequestConfig } from '@models/AuthConfig'

type Props = {
  appId: string
  value: OAuth2RequestConfig
  onChange: (value: OAuth2RequestConfig) => void
}

export function OAuthAuthorization({
  appId,
  value,
  onChange,
}: Props) {
  const [authUrl, setAuthUrl] = useState('')
  useEffect(() => {
    getAuthURL(appId, true, (url) => {
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
        if (k === 'response_type') {
          return ['code']
        }
        if (k === 'client_id') {
          return ['{{client_id}}']
        }
        if (k === 'redirect_uri') {
          return ['{{redirect_uri}}']
        }
        return ['redirect_uri', 'client_id'].map((v) => `{{${v}}}`)
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