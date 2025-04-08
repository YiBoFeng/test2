import { getAuthURL } from './getAuthURL'

export function testApp(appId: string, authType: 'oauth1' | 'oauth2') {
  return new Promise<object>((resolve, reject) => {
    getAuthURL(appId, true, authType, (url) => {
      const callback = (event: { data: string }) => {
        try {
          if (typeof event.data !== 'string') {
            return
          }
          const eventData = JSON.parse(event.data)
          window.removeEventListener('message', callback)
          if (eventData.code == 'RESPONSE_ERROR') {
            reject(eventData.message)
          } else {
            const credential = eventData.data
            resolve(credential)
          }
        } catch (error) {
          reject('Error parsing event data: ' + (error as Error).message + event.data.toString())
        }
      }
      window.open(url, 'moxoauthtester', 'width=1024,height=500')
      window.addEventListener('message', callback)
    })
  })
}