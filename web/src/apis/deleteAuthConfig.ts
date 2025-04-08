import axios from 'axios'
import { getPath } from './getPath'

export function deleteAuthConfig(app_id: string) {
  return axios.delete(getPath() + `/framework/v1/developer/apps/${app_id}/authentication`)
}