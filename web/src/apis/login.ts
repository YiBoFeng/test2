import axios from 'axios'

export function login(email: string, password: string) {
  const payload = {
    'type': 'USER_REQUEST_LOGIN',
    'object': {
      'user': {
        'email': email,
        'pass': password,
      },
    },
    'params': [{ 'name': 'USER_REQUEST_GET_ACCESS_TOKEN' }],
  }
  return axios.post('/user', payload).then((response)=>{
    return axios.post(
      '/user',
      {
        'type': 'USER_REQUEST_VERIFY_TOKEN',
        'object': {},
        'params': [{ 'name': 'USER_REQUEST_READ_SET_COOKIE' }],
      },
      {
        headers: {
          Authorization: `Bearer ${response}`,
        },
      })
  })
}