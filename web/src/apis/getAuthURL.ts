import axios from 'axios'

const integrationBaseUrl = import.meta.env.VITE_INTEGRATION_BASE_URL ?? (location.protocol + '//' + location.host + '/integration')

export function getAuthURL(appId: string, test = true, authType: 'oauth1' | 'oauth2', callback: (url: string) => void) {
  axios.post('/user', { 'type': 'USER_REQUEST_ACCESS_TOKEN', 'object': {} })
    .then((accessToken) => {
      const url =(`${integrationBaseUrl}/framework/v1/${authType}/authorize/apps/${appId}?access_token=${accessToken}`)
      if (test) {
        callback(url + '&test=true')
      } else {
        callback(url)
      }
    })
    .catch((error) => {
      console.error('Error occurred while getting the access token:', error)
    })
}