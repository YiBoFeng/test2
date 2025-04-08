import { Box, Button, Grid, TextField, Checkbox, FormControlLabel } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/ClearOutlined'
import { CustomAuthConfig } from '@models/AuthConfig'
import React from 'react'

type Props = {
  config: CustomAuthConfig
  onChange: (config: CustomAuthConfig) => void
}

export default function CustomAuth({ config, onChange }: Props) {
  return (
    <Box>
      <Grid container spacing={1} alignItems={'center'}>
        {
          config.inputs.map((input, index) => {
            return (
              <React.Fragment key={index}>
                <Grid item xs={1.5}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={input.required}
                        onChange={(e) => {
                          const newConfig = { ...config }
                          newConfig.inputs[index].required = e.target.checked
                          onChange(newConfig)
                        }}
                      />
                    }
                    label='Required'
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    label='Key'
                    value={input.key}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.inputs[index].key = e.target.value
                      onChange(newConfig)
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    label='Label'
                    value={input.label}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.inputs[index].label = e.target.value
                      onChange(newConfig)
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Tip'
                    value={input.tip}
                    onChange={(e) => {
                      const newConfig = { ...config }
                      newConfig.inputs[index].tip = e.target.value
                      onChange(newConfig)
                    }}
                  />
                </Grid>
                <Grid item xs={0.5}>
                  <Button onClick={() => {
                    const newConfig = { ...config }
                    newConfig.inputs.splice(index, 1)
                    onChange(newConfig)
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
            fullWidth
            variant='outlined'
            onClick={() => {
              const newConfig = { ...config }
              newConfig.inputs.push({
                key: '',
                label: '',
                required: true,
              })
              onChange(newConfig)
            }}
          >
            <AddIcon></AddIcon>
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
