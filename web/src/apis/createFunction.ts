import axios from 'axios'
import { getPath } from './getPath'
import { Func, FuncType } from '@models/Func'

export function createFunction(
  appId: string,
  funcType: FuncType,
  func: Func,
  zip: Blob,
) {
  const formData = new FormData()
  formData.append('file', zip)
  formData.append('by_zip', func.by_zip?.toString() ?? 'false')
  return axios.post(getPath() + `/framework/v1/developer/apps/${appId}/functions/${funcType}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}