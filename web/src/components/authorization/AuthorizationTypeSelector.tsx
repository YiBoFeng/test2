import { useEffect, useState } from 'react'
import OAuth2 from './oauth2/OAuth'
import OAuth1 from './oauth1/OAuth'
import { Button, Container, FormControl, InputLabel, LinearProgress, MenuItem, Select, Stack } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useAuthConfig } from '@hooks/useAuthConfig'
import { testApp } from '@apis/testApp'
import CustomAuth from './CustomAuth'
import { AuthConfig, OAuth1Config, OAuth2Config } from '@models/AuthConfig'

type Props = {
  appId: string
}

type AuthType = 'oauth1' | 'oauth2' | 'custom' | 'none'

export default function AuthorizationTypeSelector({ appId }: Props) {
  const { authConfig, saveAuthConfig } = useAuthConfig(appId)
  const [unsavedAuthConfig, setUnsavedAuthConfig] = useState<AuthConfig>({})
  const [saving, setSaving] = useState(false)
  const [authType, setAuthType] = useState<AuthType | undefined>()
  useEffect(() => {
    if (authConfig) {
      setUnsavedAuthConfig(authConfig)
      if (authConfig.oauth2) {
        setAuthType('oauth2')
      } else if (authConfig.oauth1) {
        setAuthType('oauth1')
      } else if (authConfig.custom) {
        setAuthType('custom')
      } else {
        setAuthType('none')
      }
    }
  }, [authConfig])

  if (!authType) {
    return <LinearProgress />
  }

  return (
    <Container sx={{ marginTop: 2 }}>
      <Stack spacing={1}>
        <FormControl>
          <InputLabel>Type</InputLabel>
          <Select
            value={authType}
            label='Type'
            onChange={(e) => {
              setAuthType(e.target.value as AuthType)
              const newUnsavedAuthConfig = { ...unsavedAuthConfig }
              switch (e.target.value) {
              case 'oauth1':
                newUnsavedAuthConfig.oauth1 = defaultOAuth1Config
                break
              case 'oauth2':
                newUnsavedAuthConfig.oauth2 = defaultOAuth2Config
                break

              case 'custom':
                newUnsavedAuthConfig.custom = {
                  inputs: [],
                }
                break

              default:
                break
              }
              setUnsavedAuthConfig(newUnsavedAuthConfig)
            }}
          >
            <MenuItem value={'none'}>NONE</MenuItem>
            <MenuItem value={'oauth1'}>OAUTH1</MenuItem>
            <MenuItem value={'oauth2'}>OAUTH2</MenuItem>
            <MenuItem value={'custom'}>CUSTOM</MenuItem>
          </Select>
        </FormControl>
        {
          authType === 'oauth1' && (
            <OAuth1
              appId={appId}
              oauth1Config={
                unsavedAuthConfig.oauth1 ? unsavedAuthConfig.oauth1 : defaultOAuth1Config
              }
              onChange={(oauth1Config) => {
                setUnsavedAuthConfig({
                  oauth1: oauth1Config,
                })
              }}
            />
          )
        }
        {
          authType === 'oauth2' && (
            <OAuth2
              appId={appId}
              oauth2Config={
                unsavedAuthConfig.oauth2 ? unsavedAuthConfig.oauth2 : defaultOAuth2Config
              }
              onChange={(oauth2Config) => {
                setUnsavedAuthConfig({
                  oauth2: oauth2Config,
                })
              }}
            />
          )
        }
        {
          authType === 'custom' && (
            <CustomAuth
              config={unsavedAuthConfig.custom ? unsavedAuthConfig.custom : { inputs: [] }}
              onChange={(config) => {
                setUnsavedAuthConfig({
                  custom: config,
                })
              }}
            />
          )
        }
        <Stack direction={'row'} spacing={1}>
          {/* {menuValue === 2 && <APIKey />} */}
          <LoadingButton
            variant={'contained'}
            loading={saving}
            onClick={() => {
              setSaving(true)
              const savingAuthConfig = { ...unsavedAuthConfig }
              switch (authType) {
              case 'oauth1':
                delete savingAuthConfig.custom
                delete savingAuthConfig.oauth2
                break
              case 'oauth2':
                delete savingAuthConfig.custom
                delete savingAuthConfig.oauth1
                break
              case 'custom':
                delete savingAuthConfig.oauth2
                delete savingAuthConfig.oauth1
                break
              default:
                delete savingAuthConfig.oauth2
                delete savingAuthConfig.custom
                delete savingAuthConfig.oauth1
                break
              }
              saveAuthConfig(savingAuthConfig)
                .then(() => {
                  setSaving(false)
                })
                .catch((err) => {
                  alert(JSON.stringify(err))
                  setSaving(false)
                })
            }}
          >
            Save
          </LoadingButton>
          {
            (authType === 'oauth2' || authType === 'oauth1') && (
              <Button
                variant={'contained'}
                onClick={() => {
                  testApp(appId, authType === 'oauth1' ? 'oauth1' : 'oauth2')
                    .then((credential) => {
                      console.log(JSON.stringify(credential))
                      alert('Success!')
                    })
                    .catch((err) => {
                      alert(JSON.stringify(err))
                    })
                }}
              >
                Test
              </Button>
            )
          }
        </Stack>
      </Stack>
    </Container>
  )
}

const defaultOAuth1Config: OAuth1Config = {
  consumer_key: '',
  consumer_secret: '',
  signature_method: 'HMAC-SHA1',
  request_token_request: {
    method: 'GET',
    queries: [
      {
        name: 'oauth_callback',
        value: '{{redirect_uri}}',
      },
      {
        name: 'oauth_consumer_key',
        value: '{{consumer_key}}',
      },
      {
        name: 'oauth_signature_method',
        value: '{{signature_method}}',
      },
      {
        name: 'oauth_version',
        value: '1.0',
      },
      {
        name: 'oauth_timestamp',
        value: '{{auto_oauth_timestamp}}',
      },
      {
        name: 'oauth_nonce',
        value: '{{auto_oauth_nonce}}',
      },
      {
        name: 'oauth_signature',
        value: '{{auto_oauth_signature}}',
      },
    ],
  },
  authorization_request: {
    method: 'GET',
    queries: [
      {
        name: 'oauth_token',
        value: '{{oauth_request_token}}',
      },
    ],
  },
  get_token_request: {
    method: 'POST',
    queries: [
      {
        name: 'oauth_consumer_key',
        value: '{{consumer_key}}',
      },
      {
        name: 'oauth_signature_method',
        value: '{{signature_method}}',
      },
      {
        name: 'oauth_token',
        value: '{{oauth_request_token}}',
      },
      {
        name: 'oauth_verifier',
        value: '{{oauth_verifier}}',
      },
      {
        name: 'oauth_version',
        value: '1.0',
      },
      {
        name: 'oauth_timestamp',
        value: '{{auto_oauth_timestamp}}',
      },
      {
        name: 'oauth_nonce',
        value: '{{auto_oauth_nonce}}',
      },
      {
        name: 'oauth_signature',
        value: '{{auto_oauth_signature}}',
      },
    ],
  },
}

const defaultOAuth2Config: OAuth2Config = {
  client_id: '',
  client_secret: '',
  authorization_request: {
    method: 'GET',
    queries: [
      {
        name: 'response_type',
        value: 'code',
      },
      {
        name: 'redirect_uri',
        value: '{{redirect_uri}}',
      },
      {
        name: 'client_id',
        value: '{{client_id}}',
      },
      {
        name: 'state',
        value: '{{state}}',
      },
    ],
  },
  get_token_request: {
    method: 'POST',
    headers: [
      {
        name: 'Content-Type',
        value: 'application/x-www-form-urlencoded',
      },
    ],
    body_fields: [
      {
        name: 'grant_type',
        value: 'authorization_code',
      },
      {
        name: 'code',
        value: '{{code}}',
      },
      {
        name: 'redirect_uri',
        value: '{{redirect_uri}}',
      },
      {
        name: 'client_id',
        value: '{{client_id}}',
      },
      {
        name: 'client_secret',
        value: '{{client_secret}}',
      },
    ],
  },
  refresh_token_request: {
    method: 'POST',
    headers: [
      {
        name: 'Content-Type',
        value: 'application/x-www-form-urlencoded',
      },
    ],
    body_fields: [
      {
        name: 'grant_type',
        value: 'refresh_token',
      },
      {
        name: 'refresh_token',
        value: '{{refresh_token}}',
      },
    ],
  },
}