import { useState, useEffect } from 'react'
import { getApp } from '@apis/getApp'
import { updateApp } from '@apis/updateApp'
import { App } from '@models/App'

export function useApp(appId: string) {
  const [app, setApp] = useState<App>()
  useEffect(() => {
    if (appId) {
      getApp(appId).then((data) => {
        setApp(data)
      }).catch((error) => {
        alert('Failed to get application ' + JSON.stringify(error))
      })
    }
  }, [appId])

  function saveApp(app: App) {
    setApp(app)
    return updateApp(appId, app)
  }

  return {
    app,
    saveApp,
  }
}
