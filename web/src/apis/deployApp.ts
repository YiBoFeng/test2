import axios from 'axios'
import { getPath } from './getPath'

export async function deployApp(appId: string, versionId: string, nodeId: string) {
  return axios.post(getPath() + `/framework/v1/admin/apps/${appId}/versions/${versionId}/deployments`, { 'node_id': nodeId })
}