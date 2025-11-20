import { RequestHandler } from 'express'
import { verifyAccessToken } from '../utils/jwt.utils'
import { Unauthorized } from '../errors/AuthError'
import { Request, Response, NextFunction } from 'express'
import { userService } from '../services/user.service'
import { UserAttributesPublic } from '../types/models/user.types'

export const authMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = String(req.headers['authorization'] ?? '')
        if (!header || !header.startsWith('Bearer ')) {
            next(new Unauthorized('Missing authorization header'))
            return
        }

        const token = header.split(' ')[1]
        const payload = verifyAccessToken<{ user_id: number }>(token)
        if (!payload || !payload.user_id) {
            next(new Unauthorized('Invalid token'))
            return
        }

        const user = await userService.getById(payload.user_id)
        if (!user) {
            next(new Unauthorized('User not found'))
            return
        }

        req.user = {
            id: user.id,
            email: user.email,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
        } as UserAttributesPublic

        next()
    } catch {
        next(new Unauthorized('Invalid or expired token'))
    }
}

export function checkPermission() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('Checking permissions for user:', req)

            // Calling authMiddleware to ensure req.user is populated
            if (!req.user) {
                await authMiddleware(req, res, async (err) => {
                    if (err) {
                        next(err)
                        return
                    }
                })
            }

            // After authMiddleware, check again
            if (!req.user) {
                throw new Unauthorized('User not authenticated')
            }

            next()
        } catch (err) {
            next(err)
        }
    }
}
