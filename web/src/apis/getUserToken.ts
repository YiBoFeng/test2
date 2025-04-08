import axios from 'axios'

export function getUserToken() {
  return axios.post('/user', { 'type': 'USER_REQUEST_ACCESS_TOKEN', 'object': {} }).catch((error) => {
    if (error.response.status === 401) {
      location.hash = '/login'
    }
  })
}