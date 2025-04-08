import axios from 'axios'
import z from 'zod'
import { getPath } from './getPath'

export const RedirectUrlSchema = z.object({
  sandbox: z.string().nullable(),
  production: z.string().nullable(),
})
export type RedirectUrl = z.infer<typeof RedirectUrlSchema>

export async function getRedirectUrl(appId: string, authType: 'oauth1' | 'oauth2'): Promise<RedirectUrl> {
  const data = await axios.get(`${getPath()}/framework/v1/developer/apps/${appId}/urls/redirect?oauthType=${authType}`)
  return RedirectUrlSchema.parse(data)
}