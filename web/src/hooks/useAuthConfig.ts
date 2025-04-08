import { useState, useEffect } from 'react'
import { getAuthConfig } from '@apis/getAuthConfig'
import { updateAuthConfig } from '@apis/updateAuthConfig'
import { createAuthConfig } from '@apis/createAuthConfig'
import { deleteAuthConfig } from '@apis/deleteAuthConfig'
import { AuthConfig } from '@models/AuthConfig'

export function useAuthConfig(appId: string) {
  const [authConfig, setAuthConfig] = useState<AuthConfig>()

  useEffect(() => {
    getAuthConfig(appId).then((data) => {
      setAuthConfig(data)
    }).catch((error) => {
      alert('Failed to get auth config ' + JSON.stringify(error))
    })
  }, [appId])

  function saveAuthConfig(data: AuthConfig) {
    if (!authConfig) {
      // auth config is not read yet.
      throw new Error('auth config is not read yet.')
    }

    setAuthConfig(data)
    if (authConfig.oauth1 || authConfig.oauth2 || authConfig.custom) {
      if (data.oauth1 ||data.oauth2 || data.custom) {
        return updateAuthConfig(appId, data)
      } else {
        return deleteAuthConfig(appId)
      }
    } else {
      return createAuthConfig(appId, data)
    }
  }

  return {
    authConfig,
    saveAuthConfig,
  }
}