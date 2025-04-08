import axios from 'axios'
import { getPath } from './getPath'
import { FuncType } from '@models/Func'
import { FunctionVersionSchema, FunctionVersion } from '@models/FunctionVersion'
import { z } from 'zod'

interface FunctionVersionResponse {
  Versions: FunctionVersion[]
}

export function getFunctionVersionList(
  appId: string,
  functionType: FuncType,
) {
  return axios.get<FunctionVersionResponse>(getPath() + `/framework/v1/developer/apps/${appId}/functions/${functionType}/versions`).then((data) => {
    return z.array(FunctionVersionSchema).parse(data.data.Versions)
  })
}