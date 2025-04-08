import axios from 'axios'
import { getPath } from './getPath'
import { FuncType } from '@models/Func'

export function testFunction(
  appId: string,
  functionType: FuncType,
  payload: string,
  webhookURL: string,
  redirectURL: string,
  credential?: object,
) {
  const payloadJson = JSON.parse(payload)
  let data = {
    ...payloadJson,
    credential: credential,
  } as object
  if (functionType === 'ACTION') {
    const callback = {
      'webhook': webhookURL===''?null:webhookURL,
      'redirect': redirectURL===''?null:redirectURL,
    } as object
    data = {
      callback: callback,
      ...data,
    }
  }
  return axios.post(getPath() + `/framework/v1/developer/apps/${appId}/functions/${functionType}/test`, data)
}
