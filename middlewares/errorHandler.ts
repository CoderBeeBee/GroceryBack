import { type NextFunction, type Request, type Response } from 'express'
import { CustomError } from '../utils/customError.ts'
import castErrorHandler from '../utils/castErrorHandler.ts'

const errorTemplate = (error: CustomError, res: Response) => {
	const isDev = process.env.NODE_ENV === 'development'

	return res.status(error.statusCode).json({
		success: false,
		status: error.statusCode,
		errorName: error.errorName,
		message: error.message,
		...(isDev
			? {
					details: error,
					stactTrace: error.stack,
				}
			: { errors: error.errors ?? null }),
	})
}

const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {
	const isDev = process.env.NODE_ENV === 'development'

	if (error instanceof CustomError) {
		
		return errorTemplate(error, res)
	}
	
	if (error instanceof Error) {
		
	
		let handleError: CustomError | undefined = undefined

		if (error.name === 'CastError') {
			handleError = castErrorHandler(error) as CustomError
		}
		if (error.name === 'SyntaxError') {
			handleError = castErrorHandler(error) as CustomError
		}
		if (error.name === 'MongoServerError' && 'code' in error) {
			handleError = castErrorHandler(error)
		}

		if (error.name === 'ValidationError') {
			handleError = castErrorHandler(error)
		}

		if (handleError) {
			return errorTemplate(handleError, res)
		}
		return res.status(500).json({
			success: false,
			status: 'error',
			message: error.message,
			...(isDev && {
				details: error,
				stackTrace: error.stack,
			}),
		})
	}

	return res.status(500).json({
		status: 'error',
		message: 'Something went wrong',
	})
}

export default errorHandler
