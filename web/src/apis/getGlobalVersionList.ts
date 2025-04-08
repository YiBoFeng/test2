import axios from 'axios'
import { getPath } from './getPath'
import { AppVersionSchema } from '@models/AppVersion'
import { z } from 'zod'

export function getGlobalVersionList() {
  return axios.get(getPath() + '/framework/v1/admin/versions').then((data) => {
    return z.array(AppVersionSchema).parse(data)
  })
}