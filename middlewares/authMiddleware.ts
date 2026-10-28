import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import { CustomError } from '../utils/customError.ts'
import User from '../models/UserModel.ts'

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.jwt
	const secret = process.env.JWT_SECRET as string
	if (!token) {
		throw new CustomError({ message: 'Not authorized, no token', statusCode: 401 })
	}

	try {
		const decoded = jwt.verify(token, secret)
		if (typeof decoded === 'string' || typeof decoded.userId !== 'string') {
			throw new CustomError({ message: 'Invalid token payload', statusCode: 401 })
		}
		req.user = await User.findById(decoded.userId)

		next()
	} catch (error) {
		throw new CustomError({ message: 'Not authorized token, failed', statusCode: 401 })
	}
}
