import z from 'zod'

export const NameValueSchema = z.object({
  name: z.string(),
  value: z.string(),
})

export type NameValue = z.infer<typeof NameValueSchema>

export const OAuth1SignatureMethodSchema = z.enum(['HMAC-SHA1', 'HMAC-SHA256', 'HMAC-SHA512', 'PLAINTEXT']) //z.enum(['HMAC-SHA1', 'HMAC-SHA256', 'HMAC-SHA512', 'RSA-SHA1', 'RSA-SHA256', 'RSA-SHA512', 'PLAINTEXT'])

export const OAuth1RequestConfigSchema = z.object({
  method: z.string().optional(),
  url: z.string().optional(),
  queries: z.array(NameValueSchema).optional(),
  headers: z.array(NameValueSchema).optional(),
  body_fields: z.array(NameValueSchema).optional(),
})

export const OAuth2RequestConfigSchema = z.object({
  method: z.string().optional(),
  url: z.string().optional(),
  queries: z.array(NameValueSchema).optional(),
  headers: z.array(NameValueSchema).optional(),
  body_fields: z.array(NameValueSchema).optional(),
})

export type OAuth1SignatureMethod = z.infer<typeof OAuth1SignatureMethodSchema>

export type OAuth1RequestConfig = z.infer<typeof OAuth1RequestConfigSchema>

export type OAuth2RequestConfig = z.infer<typeof OAuth2RequestConfigSchema>

export const OAuth1ConfigSchema = z.object({
  consumer_key: z.string().optional(),
  consumer_secret: z.string().optional(),
  signature_method: OAuth1SignatureMethodSchema.optional(),
  request_token_request: OAuth1RequestConfigSchema.optional(),
  authorization_request: OAuth1RequestConfigSchema.optional(),
  get_token_request: OAuth1RequestConfigSchema.optional(),
  test_token_request: OAuth1RequestConfigSchema.optional(),
})

export type OAuth1Config = z.infer<typeof OAuth1ConfigSchema>

export const OAuth2ConfigSchema = z.object({
  client_id: z.string().optional(),
  client_secret: z.string().optional(),
  authorization_request: OAuth2RequestConfigSchema.optional(),
  get_token_request: OAuth2RequestConfigSchema.optional(),
  refresh_token_request: OAuth2RequestConfigSchema.optional(),
  test_token_request: OAuth2RequestConfigSchema.optional(),
})

export type OAuth2Config = z.infer<typeof OAuth2ConfigSchema>

export const CustomAuthConfigInputSchema = z.object({
  key: z.string(),
  label: z.string(),
  tip: z.string().optional(),
  required: z.boolean().default(true),
})

export type CustomAuthConfigInput = z.infer<typeof CustomAuthConfigInputSchema>

export const CustomAuthConfigSchema = z.object({
  inputs: z.array(CustomAuthConfigInputSchema),
})

export type CustomAuthConfig = z.infer<typeof CustomAuthConfigSchema>

export const AuthConfigSchema = z.object({
  oauth1: OAuth1ConfigSchema.optional(),
  oauth2: OAuth2ConfigSchema.optional(),
  custom: CustomAuthConfigSchema.optional(),
})

export type AuthConfig = z.infer<typeof AuthConfigSchema>

