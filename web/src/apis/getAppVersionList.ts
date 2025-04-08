import axios from 'axios'
import { getPath } from './getPath'
import { AppVersionSchema } from '@models/AppVersion'
import { z } from 'zod'

export function getAppVersionList(appId: string) {
  return axios.get(getPath() + `/framework/v1/admin/apps/${appId}/versions`).then((data) => {
    return z.array(AppVersionSchema).parse(data)
  })
}