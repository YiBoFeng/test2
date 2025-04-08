import axios from 'axios'
import { getPath } from './getPath'
import { FuncType } from '@models/Func'

export function deleteFunction(
  appId: string,
  funcType: FuncType,
) {
  return axios.delete(getPath() + `/framework/v1/developer/apps/${appId}/functions/${funcType}`)
}