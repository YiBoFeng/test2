import z from 'zod'

export const ServerResponseSchema = z.object({
  code: z.string(),
  data: z.union([z.object({}), z.array(z.unknown())]),
})

export type ServerResponse = z.infer<typeof ServerResponseSchema>