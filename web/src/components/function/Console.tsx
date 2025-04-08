import React from 'react'
import { Box } from '@mui/material'

type Props = {
  variant: 'dark' | 'darken'
  children?: React.ReactNode
  visibleLineCount?: number
}

export default function Console({ variant, children, visibleLineCount = 10 }: Props) {
  return (
    <Box sx={{
      padding: '1em',
      height: `${visibleLineCount + 2}em`,
      backgroundColor: variant === 'darken' ? 'black' : 'darkslategrey',
      color: 'white',
      overflow: 'auto',
      overflowWrap: 'break-word',
    }}>
      <pre>
        {children}
      </pre>
    </Box>
  )
}