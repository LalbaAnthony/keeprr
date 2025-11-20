// src/middleware/log.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { logService } from '../services/log.service'
import { LogError } from '../errors/LogError'

export const bypasses = ['/', '/health']

export const logMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (bypasses.includes(req.originalUrl)) return next()
        await logService.make(`[${req.method}] ${req.originalUrl}`, 'info', req)
    } catch (e) {
        throw new LogError((e as Error).message ?? 'Logging error')
    }

    next()
}
