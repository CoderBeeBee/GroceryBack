import { CastError } from 'mongoose'
import { CustomError } from './customError.ts'

type DuplicateKeyError = Error & {
	code: 11000
	keyValue: Record<string, unknown>
}

type ValidationError = Error & {
	errors: Record<string, { message: string }>
}

const castErrorHandler = (error: unknown): CustomError | undefined => {
	const isDev = process.env.NODE_ENV !== 'development'

	if (!(error instanceof Error)) return undefined

	let msg: string = error.message
	let errors: Record<string, string> | null = null
	const statusCode = 'status' in error && typeof error.status === 'number' ? error.status : 400

	if (error.name === 'CastError') {
		const castError = error as CastError
		const fieldPath = Array.isArray(castError.path) ? castError.path.join('.') : castError.path

		msg = `Invalid value ${castError.value} for field ${fieldPath}`
	} else if (error.name === 'SyntaxError') {
		msg = 'Invalid JSON payload'
	} else if (error.name === 'MongoServerError' && 'code' in error && error.code === 11000) {
		const duplicateKeyError = error as DuplicateKeyError
		const field = Object.keys(duplicateKeyError.keyValue)[0]

		msg = `Duplicate value for field : ${field}`
	} else if (error.name === 'ValidationError') {
		const validationError = error as ValidationError
		// const fields = Object.values(validationError.errors)
		// 	.map((err: any) => err.message)
		// 	.join(', ')

		;((errors = Object.fromEntries(
			Object.entries(validationError.errors).map(([path, detail]) => [path, detail.message]),
		)),
			(msg = `Invalid input data : ${Object.values(errors).join(', ')}`))
	}

	return new CustomError({
		errorName: error.name,
		message: isDev ? error.message : msg,
		statusCode,
		error,
		errors,
	})
}

export default castErrorHandler
