import { FormControl, Stack, TextField, Typography } from '@mui/material'

type Props = {
  value: Value
  onChange: (value: Value) => void
}

type Value = {
  clientId?: string
  clientSecret?: string
}

export function OAuthCredential({ value, onChange }: Props) {
  return <Stack spacing={1}>
    <Typography variant='body2' gutterBottom>
      From your app&apos;s API or developer settings, copy the Client ID and Secret from your app and paste them below.
    </Typography>
    <FormControl fullWidth sx={{ m: 1 }}>
      <TextField
        value={value.clientId}
        label='Client ID'
        onChange={(e) => {
          onChange({
            ...value,
            clientId: e.target.value,
          })
        }}
      />
    </FormControl>
    <FormControl fullWidth>
      <TextField
        value={value.clientSecret}
        label='Client Secret'
        onChange={(e) => {
          onChange({
            ...value,
            clientSecret: e.target.value,
          })
        }}
      />
    </FormControl>
  </Stack>
}