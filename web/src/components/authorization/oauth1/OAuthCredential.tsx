import { FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { OAuth1SignatureMethodSchema } from '@src/models/AuthConfig'

type Props = {
  value: Value
  onChange: (value: Value) => void
}

type Value = {
  consumerKey?: string
  consumerSecret?: string
  signatureMethod?: string
}

export function OAuthCredential({ value, onChange }: Props) {
  return <Stack spacing={1}>
    <Typography variant='body2' gutterBottom>
      From your app&apos;s API or developer settings, copy the consumer key and secret from your app and paste them below.
    </Typography>
    <FormControl fullWidth sx={{ m: 1 }}>
      <TextField
        value={value.consumerKey}
        label='Consumer Key'
        onChange={(e) => {
          onChange({
            ...value,
            consumerKey: e.target.value,
          })
        }}
      />
    </FormControl>
    <FormControl fullWidth>
      <TextField
        value={value.consumerSecret}
        label='Consumer Secret'
        onChange={(e) => {
          onChange({
            ...value,
            consumerSecret: e.target.value,
          })
        }}
      />
    </FormControl>
    <FormControl fullWidth>
      <InputLabel>Signature Method</InputLabel>
      <Select
        label='Signature Method'
        value={value.signatureMethod}
        onChange={(e) => {
          onChange({
            ...value,
            signatureMethod: e.target.value,
          })
        }}
      >
        {OAuth1SignatureMethodSchema.options.map((method) => (
          <MenuItem key={method} value={method}>{method}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </Stack>
}