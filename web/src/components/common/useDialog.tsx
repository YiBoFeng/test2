import { LoadingButton } from '@mui/lab'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { ReactNode } from 'react'

type Props = {
  title: string
  children?: ReactNode
  open: boolean
  buttonLoading?: boolean
  haveImportButton?: boolean
  handleImport: () => void
  handleClose: () => void
  handleConfirm: () => void
}

export function UseDialog({ title, children, open, handleClose, handleConfirm, buttonLoading, handleImport, haveImportButton }: Props) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        {haveImportButton&&<LoadingButton loading={buttonLoading} hidden={true} onClick={handleImport}>Import From Zip</LoadingButton>}
        <LoadingButton loading={buttonLoading} onClick={handleClose}>Cancel</LoadingButton>
        <LoadingButton loading={buttonLoading} onClick={handleConfirm}>Confirm</LoadingButton>
      </DialogActions>
    </Dialog>
  )
}