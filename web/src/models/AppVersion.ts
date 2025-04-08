import z from 'zod'
import { IntegrationNodeSchema } from './IntegrationNode'

export const AppVersionStatusSchema = z.enum([
  'APP_VERSION_STATUS_INITIAL',
  'APP_VERSION_STATUS_RESOLVED',
])

export const AppVersionSchema = z.object({
  version_id: z.string().optional(),
  app_id: z.string().optional(),
  label: z.string().optional(),
  status: AppVersionStatusSchema.optional(),
  nodes: z.array(IntegrationNodeSchema).optional(),
  undeployed_nodes: z.array(IntegrationNodeSchema).optional(),
  created_time: z.number().optional(),
})

export type AppVerison = z.infer<typeof AppVersionSchema>