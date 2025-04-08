import axios from 'axios'
import { getPath } from './getPath'

export function createAppIcon(app_id: string, icon_base64_data: string) {
  return axios.post(getPath() + `/framework/v1/developer/apps/${app_id}/logo`, { 'base64': icon_base64_data })
}