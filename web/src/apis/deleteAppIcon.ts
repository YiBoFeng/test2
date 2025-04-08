import axios from 'axios'
import { getPath } from './getPath'

export function deleteAppIcon(appId: string) {
  return axios.delete(getPath() + '/framework/v1/developer/apps/' + appId + '/logo')
}