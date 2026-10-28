export class CustomError extends Error {
	statusCode: number
	errorName: string
	error?: Error | null
	errors: Record<string, string | string[]> | unknown | null

	constructor({
		errorName = 'CustomError',
		message,
		statusCode,
		error,
		errors,
	}: {
		errorName?: string
		message: string
		statusCode: number
		errors?: Record<string, string | string[]> | unknown | null
		error?: Error
	}) {
		super(message, error)

		this.errorName = errorName
		this.statusCode = statusCode
		this.errors = errors
		this.error = error

        Error.captureStackTrace(this,this.constructor)
	}
}
