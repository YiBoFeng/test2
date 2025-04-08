import z from 'zod'

export const FunctionVersionSchema = z.object({
  Description: z.string().optional(),
  RevisionId: z.string().optional(),
  Version: z.string().optional(),
})

export type FunctionVersion = z.infer<typeof FunctionVersionSchema>
