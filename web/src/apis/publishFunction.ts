import axios from 'axios'
import { getPath } from './getPath'
import { FuncType } from '@models/Func'

export function publishFunction(
  appId: string,
  funcType: FuncType,
  description: string,
) {
  return axios.post(getPath() + `/framework/v1/developer/apps/${appId}/functions/${funcType}/versions`, { description })
}