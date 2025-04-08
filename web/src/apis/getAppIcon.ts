import axios from 'axios'
import { getPath } from './getPath'

export function getAppIcon(appId: string) {
  return axios.get(getPath() + `/framework/v1/apps/${appId}/logo`)
}
