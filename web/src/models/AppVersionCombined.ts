import z from 'zod'

export const AppVerisonCombinedSchema = z.object({
  app_id: z.string().optional(),
  label: z.string().optional(),
  name: z.string().optional(),
})

export type AppVerisonCombined = z.infer<typeof AppVerisonCombinedSchema>
