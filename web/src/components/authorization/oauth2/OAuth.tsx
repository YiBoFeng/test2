import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { OAuthRedirectURL } from './OAuthRedirectURL'
import { OAuthCredential } from './OAuthCredential'
import { OAuthAuthorization } from './OAuthAuthorization'
import { OAuthRequestToken } from './OAuthRequestToken'
import { OAuth2Config, OAuth2RequestConfig } from '@models/AuthConfig'

type Props = {
  appId: string
  oauth2Config: OAuth2Config
  onChange: (oauth2Config: OAuth2Config) => void
}

export default function OAuth({
  appId,
  oauth2Config,
  onChange,
}: Props) {
  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography>Step 1: Copy Redirect URL</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <OAuthRedirectURL appId={appId} />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2a-content'
          id='panel2a-header'
        >
          <Typography>Step 2: App Credential</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <OAuthCredential
            value={{
              clientId: oauth2Config.client_id,
              clientSecret: oauth2Config.client_secret,
            }}
            onChange={(v) => {
              onChange({
                ...oauth2Config,
                client_id: v.clientId,
                client_secret: v.clientSecret,
              })
            }}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel3a-content'
          id='panel3a-header'
        >
          <Typography>Step 3: Enter Authorization URL</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <OAuthAuthorization
            appId={appId}
            value={oauth2Config.authorization_request ? oauth2Config.authorization_request : defaultAuthorizationConfig}
            onChange={(v) => {
              onChange({
                ...oauth2Config,
                authorization_request: v,
              })
            }}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel4a-content'
          id='panel4a-header'
        >
          <Typography>Step 4: Access Token Request</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <OAuthRequestToken
            appId={appId}
            value={{
              getTokenConfig: oauth2Config.get_token_request ? oauth2Config.get_token_request : defaultRequestTokenConfig,
              refreshTokenConfig: oauth2Config.refresh_token_request ? oauth2Config.refresh_token_request : defaultRefreshTokenConfig,
              testTokenConfig: oauth2Config.test_token_request ? oauth2Config.test_token_request : defaultTestTokenConfig,
            }}
            onChange={(v) => {
              onChange({
                ...oauth2Config,
                get_token_request: v.getTokenConfig,
                refresh_token_request: v.refreshTokenConfig,
                test_token_request: v.testTokenConfig,
              })
            }}
          />
        </AccordionDetails>
      </Accordion>
    </>
  )
}

const defaultAuthorizationConfig: OAuth2RequestConfig = {
  method: 'GET',
  url: '',
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
  ],
  headers: [],
}

const defaultRequestTokenConfig: OAuth2RequestConfig = {
  method: 'POST',
  url: '',
  queries: [],
  headers: [
    {
      name: 'Content-type',
      value: 'application/x-www-form-urlencoded',
    },
  ],
  body_fields: [],
}

const defaultRefreshTokenConfig: OAuth2RequestConfig = {
  method: 'POST',
  url: '',
  queries: [],
  headers: [
    {
      name: 'Content-type',
      value: 'application/x-www-form-urlencoded',
    },
  ],
  body_fields: [],
}

const defaultTestTokenConfig: OAuth2RequestConfig = {
  method: 'GET',
  url: '',
  queries: [],
  headers: [],
  body_fields: [],
}