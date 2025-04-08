import z from 'zod'

export const IntegrationNodeSchema = z.object({
  node_id: z.string().optional(),
  host: z.string().optional(),
  name: z.string().optional(),
})

export type IntegrationNode = z.infer<typeof IntegrationNodeSchema>