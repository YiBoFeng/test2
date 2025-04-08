import axios from 'axios'
import { getPath } from './getPath'
import { FuncType } from '@models/Func'

export function getFunctionLogs(
  appId: string,
  functionType: FuncType,
  startTime: string,
  endTime: string,
) {
  return axios.get(getPath() + `/framework/v1/developer/apps/${appId}/functions/${functionType}/log?startTimestamp=${startTime}&endTimestamp=${endTime}`)
}
