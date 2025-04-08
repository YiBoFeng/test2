import { Divider, MenuItem, Select, Stack, Tab, Tabs, TextField, Typography } from '@mui/material'
import TabPanel from '../../common/TabPanel'
import NameValuePairs from '../../common/NameValuePairs'
import { useState } from 'react'
import { OAuth1RequestConfig } from '@models/AuthConfig'

type Props = {
  appId: string
  value: Value
  onChange: (value: Value) => void
}

type Value = {
  getTokenConfig: OAuth1RequestConfig
  testTokenConfig: OAuth1RequestConfig
}

export function OAuthGetAccessToken({ value, onChange }: Props) {
  function headerVariables(key: string) {
    if (key === 'Content-Type') {
      return ['application/json', 'application/x-www-form-urlencoded']
    }
    return null
  }

  function queryOrBodyVariables(key: string, proposal: string[]) {
    if (proposal.find((v) => v === key)) {
      return [`{{${key}}}`]
    }
    return proposal.map((k) => `{{${k}}}`)
  }

  function requestTokenVariables(key: string) {
    const headersVariables = headerVariables(key)
    if (headersVariables) {
      return headersVariables
    }
    const proposal = ['consumer_key', 'signature_method', 'oauth_request_token', 'oauth_verifier', 'auto_oauth_timestamp', 'auto_oauth_nonce', 'auto_oauth_signature']
    return queryOrBodyVariables(key, proposal)
  }

  function testTokenVariables(key: string) {
    const headersVariables = headerVariables(key)
    if (headersVariables) {
      return headersVariables
    }
    const proposal = ['access_token', 'token_secret', 'consumer_key', 'signature_method', 'auto_oauth_timestamp', 'auto_oauth_nonce', 'auto_oauth_signature']
    return queryOrBodyVariables(key, proposal)
    // return []
  }

  return <Stack spacing={2} divider={<Divider></Divider>}>
    <OAuthRequestSection
      title='Request Access Token'
      description='Enter the API endpoint URL where Moxo sends the approval code on user redirect, typically via POST, and receives access_token in the response.'
      config={value.getTokenConfig}
      valueOptionsProvider={requestTokenVariables}
      onChange={(v) => {
        onChange({
          ...value,
          getTokenConfig: v,
        })
      }}
    ></OAuthRequestSection>
    <OAuthRequestSection
      title='Test Access Token'
      description='Enter an API endpoint URL to test authentication credentials, ideally one needing no configuration such as /me.'
      config={value.testTokenConfig}
      valueOptionsProvider={testTokenVariables}
      onChange={(v) => {
        onChange({
          ...value,
          testTokenConfig: v,
        })
      }}
    ></OAuthRequestSection>
  </Stack>
}

type SectionProps = {
  title: string
  description: string
  config: OAuth1RequestConfig
  valueOptionsProvider?: (key: string) => string[]
  onChange: (config: OAuth1RequestConfig) => void
}

function OAuthRequestSection({ title, description, config, valueOptionsProvider, onChange }: SectionProps) {
  const [tab, setTab] = useState(0)
  return (
    <Stack spacing={1}>
      <Typography variant='body1' gutterBottom fontWeight={'bold'}>
        {title}
      </Typography>
      <Typography variant='body2' gutterBottom>
        {description}
      </Typography>
      <Stack direction={'row'} spacing={1} sx={{ display: 'flex' }}>
        <Select
          value={config.method}
          onChange={(e) => {
            onChange({
              ...config,
              method: e.target.value,
            })
          }}
        >
          <MenuItem value={'GET'}>GET</MenuItem>
          <MenuItem value={'POST'}>POST</MenuItem>
        </Select>
        <TextField
          value={config.url}
          label='Endpoint'
          onChange={(e) => {
            onChange({
              ...config,
              url: e.target.value,
            })
          }}
          sx={{ flexGrow: 1 }}
        />
      </Stack>
      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} aria-label='basic tabs example'>
        <Tab label='URL Params' />
        <Tab label='Headers' />
        <Tab label='Body' />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <NameValuePairs pairs={config.queries} onChange={(v) => {
          onChange({
            ...config,
            queries: v,
          })
        }} valueOptionsProvider={valueOptionsProvider}></NameValuePairs>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <NameValuePairs pairs={config.headers} onChange={(v) => {
          onChange({
            ...config,
            headers: v,
          })
        }} valueOptionsProvider={valueOptionsProvider}></NameValuePairs>
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <NameValuePairs pairs={config.body_fields} onChange={(v) => {
          onChange({
            ...config,
            body_fields: v,
          })
        }} valueOptionsProvider={valueOptionsProvider}></NameValuePairs>
      </TabPanel>
    </Stack>
  )
}