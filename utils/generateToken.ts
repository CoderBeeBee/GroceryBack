import { type Response } from 'express'
import jwt from 'jsonwebtoken'
import { CustomError } from './customError.ts'

const generateToken = (res: Response, userId: Object, role:string) => {
	const secret = process.env.JWT_SECRET as string
	const isProd = process.env.NODE_ENV === 'production'

	if (!secret) {
		throw new CustomError({ message: 'Missing JWT_SECRET', statusCode: 500 })
	}

	const token = jwt.sign({ userId,role }, secret, {
		expiresIn: '30d',
	})

	res.cookie('jwt', token, {
		httpOnly: true,
		secure: isProd,
		sameSite: isProd ? 'none' : 'strict',
		maxAge: 30 * 24 * 60 * 60 * 1000,
	})

	return token
}

export { generateToken }
