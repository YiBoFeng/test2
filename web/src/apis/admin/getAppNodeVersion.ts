import axios from 'axios'
import { getPath } from '../getPath'
import { AppVersionSchema } from '@models/AppVersion'

export function getAppNodeVersion(appId: string, nodeId: string) {
  return axios.get(getPath() + '/framework/v1/admin/apps/' + appId + '/nodes/' + nodeId + '/versions').then((data) => {
    return AppVersionSchema.parse(data)
  })
}