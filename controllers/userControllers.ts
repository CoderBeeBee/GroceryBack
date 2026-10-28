import { type Request, type Response } from 'express'
import User from '../models/UserModel.ts'
import { type createUserType } from '../types/createUserSchema.ts'
import { CustomError } from '../utils/customError.ts'
import cloudinary from '../config/cloudinaryConfig.ts'
import { Types } from 'mongoose'
import LegalDocuments from '../models/LegalDocuments.ts'
import cloudinaryInitials from '../utils/cloudinaryInitials.ts'
import { type signInType } from '../types/signInSchema.ts'
import { verify } from 'argon2'
import { generateToken } from '../utils/generateToken.ts'

const createUser = async (req: Request, res: Response) => {
	const { email, password, firstName, lastName } = req.validatedBody as unknown as createUserType

	const existingUser = await User.findOne({ email })

	if (existingUser) {
		throw new CustomError({ message: 'userExist', statusCode: 400 })
	}

	const imageUrl = await cloudinaryInitials(firstName, lastName)

	const privacy = await LegalDocuments.findOne({
		type: 'privacyPolicy',
		language: 'EN',
		isActive: true,
	}).select('_id')
	const terms = await LegalDocuments.findOne({
		type: 'terms',
		language: 'EN',
		isActive: true,
	}).select('_id')

	const newUser = new User({
		email,
		password,
		firstName,
		lastName,
		image: {
			src: imageUrl,
		},

		consents: {
			privacyPolicy: {
				documentId: new Types.ObjectId(`${privacy?._id}`),
				acceptedAt: new Date(),
			},
			terms: {
				documentId: new Types.ObjectId(`${terms?._id}`),
				acceptedAt: new Date(),
			},
		},
	})
	await newUser.save()

	return res.status(201).json({ message: 'registrationComplete' })
}

const signIn = async (req: Request, res: Response) => {
	const { email, password } = req.validatedBody as unknown as signInType

	const user = await User.findOne({ email }).select('+password')
	if (!user) throw new CustomError({ message: 'invalidCredentials', statusCode: 401 })

	if (!user.isVerified) throw new CustomError({ message: 'userNotVerified', statusCode: 400 })

	if (user.status !== 'active') throw new CustomError({ message: 'accountInactive', statusCode: 400 })
	const isPasswordValid = await verify(user.password, password)
	if (!isPasswordValid) {
		throw new CustomError({ message: 'invalidCredentials', statusCode: 401 })
	}

	await User.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } })

	generateToken(res, user._id, user.role)

	return res.status(200).json({
		id: user._id,
		firstName: user.firstName,
		lastName: user.lastName,
		image: user.image?.src,
		role: user.role,
	})
}

const signOut = async (req: Request, res: Response) => {
	const userId = req.user?._id
	const isProd = process.env.NODE_ENV === 'production'
	if (!userId) {
		throw new CustomError({ message: 'Not authorized', statusCode: 401 })
	}

	await User.updateOne({ _id: userId }, { $set: { lastLogout: new Date() } })

	res.clearCookie('jwt', {
		httpOnly: true,
		secure: isProd,
		sameSite: isProd ? 'none' : 'strict',
	})

	res.status(200).json({ message: 'You have been successfully logged out.' })
}

export { createUser, signIn, signOut }
