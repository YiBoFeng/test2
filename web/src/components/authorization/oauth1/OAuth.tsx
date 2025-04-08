import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { OAuthRedirectURL } from './OAuthRedirectURL'
import { OAuthCredential } from './OAuthCredential'
import { OAuthAuthorization } from './OAuthAuthorization'
import { OAuthGetAccessToken } from './OAuthGetAccessToken'
import { OAuthGetRequestToken } from './OAuthGetRequestToken'
import { OAuth1Config, OAuth1RequestConfig, OAuth1SignatureMethod } from '@models/AuthConfig'

type Props = {
  appId: string
  oauth1Config: OAuth1Config
  onChange: (oauth1Config: OAuth1Config) => void
}

export default function OAuth({
  appId,
  oauth1Config,
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
              consumerKey: oauth1Config.consumer_key,
              consumerSecret: oauth1Config.consumer_secret,
              signatureMethod: oauth1Config.signature_method,
            }}
            onChange={(v) => {
              onChange({
                ...oauth1Config,
                consumer_key: v.consumerKey,
                consumer_secret: v.consumerSecret,
                signature_method: v.signatureMethod as OAuth1SignatureMethod,
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
          <Typography>Step 3: Get Request Token</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <OAuthGetRequestToken
            appId={appId}
            value={{
              getTokenConfig: oauth1Config.request_token_request ? oauth1Config.request_token_request : defaultRequestTokenConfig,
            }}
            onChange={(v) => {
              onChange({
                ...oauth1Config,
                request_token_request: v.getTokenConfig,
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
          <Typography>Step 4: Enter Authorization URL</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <OAuthAuthorization
            appId={appId}
            value={oauth1Config.authorization_request ? oauth1Config.authorization_request : defaultAuthorizationConfig}
            onChange={(v) => {
              onChange({
                ...oauth1Config,
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
          <Typography>Step 5: Access Token Request</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <OAuthGetAccessToken
            appId={appId}
            value={{
              getTokenConfig: oauth1Config.get_token_request ? oauth1Config.get_token_request : defaultRequestTokenConfig,
              testTokenConfig: oauth1Config.test_token_request ? oauth1Config.test_token_request : defaultTestTokenConfig,
            }}
            onChange={(v) => {
              onChange({
                ...oauth1Config,
                get_token_request: v.getTokenConfig,
                test_token_request: v.testTokenConfig,
              })
            }}
          />
        </AccordionDetails>
      </Accordion>
    </>
  )
}

const defaultAuthorizationConfig: OAuth1RequestConfig = {
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

const defaultRequestTokenConfig: OAuth1RequestConfig = {
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

const defaultTestTokenConfig: OAuth1RequestConfig = {
  method: 'GET',
  url: '',
  queries: [],
  headers: [],
  body_fields: [],
}