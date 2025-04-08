import axios from 'axios'
import { getPath } from './getPath'
import { AppSchema } from '@models/App'

export function getApp(appId: string) {
  return axios.get(getPath() + '/framework/v1/developer/apps/' + appId).then((data) => {
    return AppSchema.parse(data)
  })
}

export function getAppDataForDownload(appId: string) {
  return axios.get(getPath() + '/framework/v1/developer/apps/' + appId+ '?dataForDownload=true').then((data) => {
    return Object(data)
  })
}