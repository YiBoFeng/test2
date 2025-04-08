import { Autocomplete, TextField } from '@mui/material'
import React from 'react'

type Props = {
	value?: string
	valueOptions?: string[]
	onChange?: (value: string) => void
}

export default function OAuthParamTextField({ value, valueOptions: supportedVariables, onChange }: Props) {
  const textField = (
    <TextField
      hiddenLabel
      fullWidth
    />
  )

  return (
    <Autocomplete
      freeSolo
      options={supportedVariables ? supportedVariables : []}
      filterOptions={(options) => options} //always show all options
      inputValue={value}
      onInputChange={(_, value) => {
        onChange?.(value)
      }}
      renderInput={(params) => React.cloneElement(textField, params)}
    />
  )
}