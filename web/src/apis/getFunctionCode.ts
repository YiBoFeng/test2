import axios from 'axios'
import { getPath } from './getPath'
import { FuncType } from '@models/Func'

export function getFunctionCode(
  appId: string,
  functionType: FuncType,
  version: string,
) {
  return axios.get(getPath() + `/framework/v1/developer/apps/${appId}/functions/${functionType}/zip?version=${version}`, {
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'application/zip',
    },
  })
}
