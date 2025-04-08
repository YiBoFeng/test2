import { Box, Button, Grid } from '@mui/material'
import RemoveIcon from '@mui/icons-material/ClearOutlined'
import OAuthParamTextField from './OAuthParamTextField'
import AddIcon from '@mui/icons-material/Add'
import React from 'react'

type Pair = {
  name: string
  value: string
}

type Props = {
  pairs?: Pair[]
  onChange: (pairs: Pair[]) => void
  valueOptionsProvider?: (key: string) => string[]
}

export default function NameValuePairs({ pairs, onChange, valueOptionsProvider }: Props) {
  if (!pairs) {
    pairs = []
  }
  return <Box>
    <Grid container spacing={1} alignItems={'center'}>
      {
        pairs.map((pair, index) => {
          return (
            <React.Fragment key={index}>
              <Grid item xs={6}>
                <OAuthParamTextField
                  value={pair.name}
                  onChange={(v) => {
                    const newPairs = [...pairs]
                    newPairs[index].name = v
                    onChange(newPairs)
                  }} />
              </Grid>
              <Grid item xs={5.5}>
                <OAuthParamTextField
                  value={pair.value}
                  valueOptions={valueOptionsProvider?.(pairs[index].name)}
                  onChange={(v) => {
                    const newPairs = [...pairs]
                    newPairs[index].value = v
                    onChange(newPairs)
                  }} />
              </Grid>
              <Grid item xs={0.5}>
                <Button onClick={() => {
                  const newPairs = [...pairs]
                  newPairs.splice(index, 1)
                  onChange(newPairs)
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
          variant='outlined'
          fullWidth
          onClick={() => {
            const newPairs = [...pairs]
            newPairs.push({ name: '', value: '' })
            onChange(newPairs)
          }}>
          <AddIcon></AddIcon>
        </Button>
      </Grid>
    </Grid>
  </Box>
}