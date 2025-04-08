import z from 'zod'

export const FuncTypeSchema = z.enum([
  'IDENTITY',
  'BUILD',
  'ACTION',
  'REDIRECT',
  'WEBHOOK',
])

export type FuncType = z.infer<typeof FuncTypeSchema>

export const FuncSchema = z.object({
  by_zip: z.boolean().optional(),
})

export type Func = z.infer<typeof FuncSchema>