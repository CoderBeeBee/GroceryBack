import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/connectDB.ts'
import disconnectDB from './config/disconnetDB.ts'

dotenv.config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(
	cors({
		origin: process.env.SITE_URL,
		credentials: true,
	}),
)
app.use(cookieParser())
app.use(morgan('common'))

const PORT = process.env.PORT || 9000

let server: any

const startSever = async () => {
	try {
		await connectDB()

		server = app.listen(PORT, async () => {
			console.log(`Server is running on PORT:${PORT}`)
		})
	} catch (error) {
		console.log(`Cannot connect to the server: ${error}`)
	}
}

startSever()

process.on('unhandledRejection', async (error: Error) => {
	console.log(`Unhandled Rejection : ${error}`)

	process.exit(1)
})

process.on('uncaughtException', async (error: Error) => {
	console.log(`Uncaught exception : ${error}`)

	process.exit(1)
})

process.on('SIGTERM', async() => {
	console.log(`SIGTERM signal received : closing HTTP server`)

	server.close(async () => {
        await disconnectDB()
		console.log(`HTTP server closed`)
		process.exit(0)
	})
})
