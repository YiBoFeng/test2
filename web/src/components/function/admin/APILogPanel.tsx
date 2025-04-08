import { useState } from 'react'
import { Stack } from '@mui/material'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import Console from '../Console'
import { LoadingButton } from '@mui/lab'
import { DateTimePicker } from '@mui/x-date-pickers'
import { getFunctionLogs } from '@apis/admin/getFunctionLogs'
import { FuncType } from '@models/Func'

type Props = {
  nodeId: string
  appId: string
  functionType: FuncType
}

export function APILogPanel({ nodeId, appId, functionType }: Props) {
  const [startTime, setStartTime] = useState(dayjs().subtract(1, 'hour'))
  const [endTime, setEndTime] = useState(dayjs())
  const [log, setLog] = useState('')
  const [logLoading, setLogLoading] = useState(false)

  function viewLog() {
    setLog('')
    if (endTime.valueOf() - startTime.valueOf() > 5 * 24 * 60 * 60 * 1000) {
      alert('Time range should not be greater than 5 days.')
      return
    } else if (endTime.valueOf() - startTime.valueOf() < 0) {
      alert('Start time should be less than end time.')
      return
    }

    setLogLoading(true)
    getFunctionLogs(nodeId, appId, functionType, startTime.valueOf().toString(), endTime.valueOf().toString()).then((data) => {
      setLog(data as unknown as string)
      setLogLoading(false)
    }).catch((error) => {
      alert(error)
      setLogLoading(false)
    })
  }

  return <Stack spacing={2}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction={'row'} spacing={1}>
        <DateTimePicker
          label='Start time'
          value={startTime}
          onChange={(v: dayjs.Dayjs | null) => {
            if (v) setStartTime(v)
          }}
        />
        <DateTimePicker
          label='End time'
          value={endTime}
          minDateTime={startTime}
          onChange={(v: dayjs.Dayjs | null) => {
            if (v) setEndTime(v)
          }}
        />
      </Stack>
    </LocalizationProvider>
    <Console variant={'dark'} visibleLineCount={20}>{log}</Console>
    <Stack direction={'row'} spacing={1}>
      <LoadingButton loading={logLoading} variant={'contained'} onClick={viewLog}>View</LoadingButton>
    </Stack>
  </Stack>
}