import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(128),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  consents:z.boolean().refine(v => v=== true)
})

export type createUserType = z.infer<typeof createUserSchema>