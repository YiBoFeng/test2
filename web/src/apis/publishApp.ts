import axios from 'axios'
import { getPath } from './getPath'

export function publishApp(
  appId: string,
  label: string,
) {
  return axios.post(getPath() + `/framework/v1/developer/apps/${appId}/versions`, { label })
}
