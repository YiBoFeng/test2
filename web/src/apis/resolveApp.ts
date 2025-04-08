import axios from 'axios'
import { getPath } from './getPath'

export function resolveApp(appId: string, versionId: string) {
  return axios.patch(getPath() + `/framework/v1/admin/apps/${appId}/versions/${versionId}`, { 'status': 'APP_VERSION_STATUS_RESOLVED' })
}
