import { Box, LinearProgress, Modal } from '@mui/material'
import { useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
}

export default function DocModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(true)
  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div style={{
        position: 'absolute',
        height: '90%',
        width: '80%',
        left: '10%',
        top: '5%',
        backgroundColor: 'white',
      }}>
        <iframe
          style={{
            height: '100%',
            width: '100%',
            border: 'none',
          }}
          src={
            '/integration/developer/docs/index.html'
          }
          onLoad={() => setLoading(false)}
        />
        {
          loading &&
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px' }}>
            <LinearProgress />
          </Box>
        }
      </div>
    </Modal>
  )
}