import express, { Express, Request, Response } from 'express'
import { Return } from './types/utils/api.types'
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "./swagger.json"
import noteRoutes from './routes/note.routes'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import { NotFound } from './errors/HttpError'
import { NextFunction } from 'express-serve-static-core'
import { errorMiddleware } from './middlewares/error.middleware'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app: Express = express()

// Parse JSON bodies (as sent by API clients)
app.use(express.json({ limit: '10mb' }))

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }))

// CORS middleware to allow cross-origin requests. It MUST be before any route cuz of preflight requests
app.use(cors({
    origin: process.env.BACKEND_CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}))

// root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: '/ of the backend server',
  } as Return)
})

// Serve Swagger documentation
if (process.env.NODE_ENV !== 'production') {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  console.log('Swagger documentation available at /swagger')
} else {
  console.warn('Swagger documentation is not available in production mode')
}

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Backend server is healthy',
    timestamp: new Date().toISOString(),
  } as Return)
})

// Register routes
app.use('/notes', noteRoutes)
app.use('/users', userRoutes)
app.use('/auth', authRoutes)

// If nothing found above, return 404
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFound('No route here on ' + req.originalUrl + ' with ' + req.method))
  return
})

// Error handler
app.use(errorMiddleware)

export default app
