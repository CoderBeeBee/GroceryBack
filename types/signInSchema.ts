import z from "zod";


export const signInSchema = z.object({
    email:z.email().min(6).max(254),
    password:z.string().min(8).max(128)
})

export type signInType = z.infer<typeof signInSchema>