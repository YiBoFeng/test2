import axios from 'axios'
import { getPath } from './getPath'
import { FuncSchema, FuncType } from '@models/Func'

export function getFunction(
  appId: string,
  functionType: FuncType,
) {
  return axios.get(getPath() + `/framework/v1/developer/apps/${appId}/functions/${functionType}`)
    .then((data) => {
      return FuncSchema.parse(data)
    })
}