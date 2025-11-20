// middlewares/error.middleware.ts
import { ErrorRequestHandler } from 'express'
import { GlobalError } from '../errors/GlobalError'
import { Return } from '../types/utils/api.types'

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, next) => {
    console.error(err)

    if (res.headersSent) next(err) // If headers are already sent, delegate to the default Express error handler

    res.status(err instanceof GlobalError ? err.code : 500).json({
        message: err instanceof GlobalError ? err.message : 'Internal Server Error',
    } as Return)
}
