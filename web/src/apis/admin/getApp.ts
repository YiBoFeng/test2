import axios from 'axios'
import { getPath } from '../getPath'
import { AppSchema } from '@models/App'

export function getApp(appId: string) {
  return axios.get(getPath() + '/framework/v1/admin/apps/' + appId).then((data) => {
    return AppSchema.parse(data)
  })
}