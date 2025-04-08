import axios, { AxiosRequestHeaders } from 'axios'
import { has } from 'lodash'

axios.defaults.headers.common['Accept'] = 'application/json'

export function interceptAuthentication() {
  axios.interceptors.request.use(async function(config) {
    const { headers } = config
    if (config.url === '/user' || config.url === '/board') {
      return config
    }
    try {
      const access_token = await axios.post('/user', { 'type': 'USER_REQUEST_ACCESS_TOKEN', 'object': {} })
      config.headers = {
        'Content-Type': 'application/json',
        'Authorization': `Integration access_token=${access_token}`,
        ...headers,
      } as AxiosRequestHeaders
      return config
    } catch (error) {
      return Promise.reject(error)
    }
  })
  axios.interceptors.response.use(function(res) {
    if (res.headers['content-type'] === 'application/json' && res.data && has(res.data, 'data')) {
      return res.data.data
    } else {
      return res
    }
  }, (error) => {
    return Promise.reject(error)
  })
}