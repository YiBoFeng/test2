import { useState } from 'react'
import { Stack } from '@mui/material'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import Console from './Console'
import { LoadingButton } from '@mui/lab'
import { DateTimePicker } from '@mui/x-date-pickers'
import { getFunctionLogs } from '@apis/getFunctionLogs'
import { FuncType, FuncTypeSchema } from '@models/Func'

type Props = {
  appId: string
  functionType: FuncType | 'ALL'
}

export function APILogPanel({ appId, functionType }: Props) {
  const [startTime, setStartTime] = useState(dayjs().subtract(1, 'hour'))
  const [endTime, setEndTime] = useState(dayjs())
  const [log, setLog] = useState('')
  const [logLoading, setLogLoading] = useState(false)

  async function viewLog() {
    setLog('')
    if (endTime.valueOf() - startTime.valueOf() > 5 * 24 * 60 * 60 * 1000) {
      alert('Time range should not be greater than 5 days.')
      return
    } else if (endTime.valueOf() - startTime.valueOf() < 0) {
      alert('Start time should be less than end time.')
      return
    }

    setLogLoading(true)

    if (functionType === 'ALL') {
      const fetchLogs = async() => {
        try {
          const types = FuncTypeSchema.options
          const logPromises = types.map((type) =>
            getFunctionLogs(appId, type, startTime.valueOf().toString(), endTime.valueOf().toString())
              .then((data) => {
                const logLines = (data as unknown as string).split('\n')
                const timeRegex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)/
                let currentSublog = ''
                const sublogs = []
      
                logLines.filter((line) => line).forEach((line) => {
                  if (timeRegex.test(line)) {
                    if (currentSublog) {
                      sublogs.push(`${type} FUNCTION\t${currentSublog.trim()}`)
                    }
                    currentSublog = line
                  } else {
                    currentSublog += `\n${line}`
                  }
                })
                if (currentSublog) {
                  sublogs.push(`${type} FUNCTION\t${currentSublog.trim()}`)
                }
      
                return sublogs
              })
              .catch((error) => {
                console.error(error)
                return []
              }),
          )
          const allSublogs = (await Promise.all(logPromises)).flat()
          const timeRegex = /^\S+\s+(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z)/
          const sortedSublogs = allSublogs
            .filter((log) => log)
            .sort((a, b) => {
              const timeA = a.match(timeRegex)?.[1] || ''
              const timeB = b.match(timeRegex)?.[1] || ''
              return new Date(timeA).getTime() - new Date(timeB).getTime()
            })
          const finalLog = sortedSublogs.join('\n')
          setLog(finalLog)
        } catch (error) {
          console.error(error)
        } finally {
          setLogLoading(false)
        }
      }
      fetchLogs()
    }
    else {
      getFunctionLogs(appId, functionType, startTime.valueOf().toString(), endTime.valueOf().toString()).then((data) => {
        setLog(data as unknown as string)
        setLogLoading(false)
      }).catch((error) => {
        alert(error)
        setLogLoading(false)
      })
    }
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