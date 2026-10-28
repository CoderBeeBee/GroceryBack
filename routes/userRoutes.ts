import { Router } from 'express'
import { registerLimiter } from '../utils/limiter.ts'

import { createUserSchema } from '../types/createUserSchema.ts'
import validate from '../utils/validate.ts'
import { createUser, signIn, signOut } from '../controllers/userControllers.ts'
import { signInSchema } from '../types/signInSchema.ts'
import { authenticate } from '../middlewares/authMiddleware.ts'

const router = Router()

router.post('/createUser', registerLimiter, validate(createUserSchema, 'body', 'validatedBody'), createUser)
router.post('/signIn', validate(signInSchema, 'body', 'validatedBody'), signIn)
router.post('/signOut', authenticate, signOut)

export default router
