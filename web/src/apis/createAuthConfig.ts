import axios from 'axios'
import { getPath } from './getPath'

export function createAuthConfig(app_id: string, config: object) {
  return axios.post(getPath() + `/framework/v1/developer/apps/${app_id}/authentication`, config)
}