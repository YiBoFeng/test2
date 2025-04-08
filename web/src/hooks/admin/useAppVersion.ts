import { useState, useEffect } from 'react'
import { App } from '@models/App'
import { getGlobalAppList } from '@apis/getGlobalAppList'
import { getGlobalVersionList } from '@apis/getGlobalVersionList'
import { AppVerison } from '@models/AppVersion'
import { deployApp } from '@apis/deployApp'

export function useAppVersion(appId: string) {
  const [app, setApp] = useState<App | null>()
  const [version, setVersion] = useState<AppVerison | null>()

  useEffect(() => {
    Promise.all([getGlobalAppList(), getGlobalVersionList()])
      .then(([apps, versions]) => {
        const matchedApp = apps.find((app) => app.app_id === appId)
        const matchedVersion = versions.find((version) => version.app_id === appId)
        if (matchedApp && matchedVersion && (matchedVersion.status === null || matchedVersion.status === 'APP_VERSION_STATUS_RESOLVED')) {
          alert('Failed to fetch data')
          setApp(null)
          setVersion(null)
          return
        }
        setApp(matchedApp)
        setVersion(matchedVersion)
      })
      .catch((error) => {
        alert('Failed to get application info' + JSON.stringify(error))
      })
  }, [appId])

  function deployAppVersion(node_id: string) {
    if (!version || !version.version_id || !node_id) {
      return
    }
    return deployApp(appId, version.version_id, node_id).then(() => {
      const updatedNodes = version.nodes ? [...version.nodes] : []
      updatedNodes.push({ node_id })
      setVersion({ ...version, nodes: updatedNodes })
    }).catch(() => {
      alert('Failed to deploy')
    })
  }

  return {
    app,
    version,
    deployAppVersion,
  }
}
