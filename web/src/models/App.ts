import z from 'zod'

export const AppActionTypeSchema = z.enum([
  'APP_ACTION_TYPE_ACTION',
  'APP_ACTION_TYPE_AUTOMATION',
  'APP_ACTION_TYPE_AWAIT',
  'APP_ACTION_TYPE_TRIGGER',
])

export function appActionTypeLabel(type: AppActionType) {
  switch (type) {
    case 'APP_ACTION_TYPE_ACTION':
      return 'Action'
    case 'APP_ACTION_TYPE_AUTOMATION':
      return 'Automation'
    case 'APP_ACTION_TYPE_AWAIT':
      return 'Await'
    case 'APP_ACTION_TYPE_TRIGGER':
      return 'Trigger'
  }
}

export type AppActionType = z.infer<typeof AppActionTypeSchema>

export const AppCategorySchema = z.enum([
  'APP_CATEGORY_E_SIGNATURE',
  'APP_CATEGORY_FORM',
  'APP_CATEGORY_PAYMENT',
  'APP_CATEGORY_TIME_BOOKING',
  'APP_CATEGORY_TODO',
  'APP_CATEGORY_ID_VERIFICATION',
])

export function appCategoryLabel(category: AppCategory) {
  switch (category) {
  case 'APP_CATEGORY_E_SIGNATURE':
    return 'E-Signature'
  case 'APP_CATEGORY_FORM':
    return 'Form'
  case 'APP_CATEGORY_PAYMENT':
    return 'Payment'
  case 'APP_CATEGORY_TIME_BOOKING':
    return 'Time Booking'
  case 'APP_CATEGORY_TODO':
    return 'To-do'
  case 'APP_CATEGORY_ID_VERIFICATION':
    return 'ID Verification'
  }
}

export type AppCategory = z.infer<typeof AppCategorySchema>

export const AppActionSchema = z.object({
  key: z.string().optional(),
  title: z.string().optional(),
  type: AppActionTypeSchema.optional(),
})

export const AppSchema = z.object({
  app_id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  category: AppCategorySchema.optional(),
  actions: z.array(AppActionSchema).optional().default([]),
})

export type App = z.infer<typeof AppSchema>
