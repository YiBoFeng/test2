import axios from 'axios'
import { getPath } from './getPath'
import { AuthConfig } from '@models/AuthConfig'

export function updateAuthConfig(appId: string, config: AuthConfig) {
  return axios.patch(getPath() + `/framework/v1/developer/apps/${appId}/authentication`, config)
}