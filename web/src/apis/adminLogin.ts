import axios from 'axios'

export function adminLogin(email: string, password: string) {
  const payload = {
    'type': 'USER_REQUEST_LOGIN',
    'object': {
      'user': {
        'email': email,
        'pass': password,
      },
    },
    'params': [{ 'name': 'USER_REQUEST_GET_ACCESS_TOKEN' }, { 'name': 'USER_REQUEST_LOGIN_PARTNER_ADMIN_EXPECTED' }],
  }
  return axios.post('/board', payload).then(()=>{
    return axios.post(
      '/board',
      {
        'type': 'USER_REQUEST_VERIFY_TOKEN',
        'object': {},
        'params': [],
      })
  })
}