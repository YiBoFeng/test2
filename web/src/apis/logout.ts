import axios from 'axios'

export function logout() {
  return axios.post('/user', { type: 'USER_REQUEST_LOGOUT' })
}