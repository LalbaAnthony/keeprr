import express, { Express, Request, Response } from 'express'
import { Return } from './types/api.types'
import notesRouter from './routes/note.routes';
import cookieParser from 'cookie-parser';

const app: Express = express()

// Enable parsing of cookies
app.use(cookieParser());

// Parse JSON bodies (as sent by API clients)
app.use(express.json({ limit: '10mb' }))

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  } as Return)
})

// Register routes
app.use('/notes', notesRouter);

// Redirect to home page for any unknown routes
app.use((_req: Request, res: Response): void => {
  res.redirect('/');
})

// Global error handler
app.use((err: Error, _req: Request, res: Response): void => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' } as Return);
});

export default app

