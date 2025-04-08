import axios from 'axios'
import { getPath } from './getPath'
import { AuthConfigSchema } from '@models/AuthConfig'

export function getAuthConfig(appId: string) {
  return axios.get(getPath() + `/framework/v1/developer/apps/${appId}/authentication`)
    .then((data) => {
      return AuthConfigSchema.parse(data)
    })
}
