import axios from 'axios'
import { getPath } from '../getPath'

export function deleteApp(nodeId: string, appId: string) {
  return axios.delete(getPath() + `/framework/v1/admin/nodes/${nodeId}/apps/${appId}/deployments`)
}