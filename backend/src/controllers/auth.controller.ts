import { RequestHandler } from 'express'
import { authService } from '../services/auth.service'
import { BadRequest } from '../errors/HttpError'
import { Unauthorized } from '../errors/AuthError'
import { Return } from '../types/utils/api.types'

export class AuthController {
    public register: RequestHandler = async (req, res, next) => {
        try {
            const { email, password, username } = req.body
            if (!email || !password || !username) {
                next(new BadRequest('Missing required fields'))
                return
            }

            const user = await authService.register({ email, password, username, status: 'active' })
            res.status(201).json({ data: user, message: 'User registered' } as Return)
        } catch (err: unknown) {
            next(new BadRequest((err as Error).message ?? 'Unable to register user'))
        }
    }

    public login: RequestHandler = async (req, res, next) => {
        try {
            const { identifier, password } = req.body
            if (!identifier || !password) {
                next(new BadRequest('Missing credentials'))
                return
            }

            const result = await authService.login(identifier, password)
            res.json({ data: result, message: 'Login successful' } as Return)
        } catch (err: unknown) {
            next(new Unauthorized((err as Error).message ?? 'Invalid credentials'))
        }
    }

    public refresh: RequestHandler = async (req, res, next) => {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) {
                next(new BadRequest('Missing refresh token'))
                return
            }

            const tokens = await authService.refreshToken(refreshToken)
            res.json({ data: tokens, message: 'Token refreshed' } as Return)
        } catch (err: unknown) {
            next(new Unauthorized((err as Error).message ?? 'Invalid refresh token'))
        }
    }

    public logout: RequestHandler = async (req, res, next) => {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) {
                next(new BadRequest('Missing refresh token'));
                return
            }

            await authService.logout(refreshToken)
            res.json({ message: 'Logged out' } as Return)
        } catch (err: unknown) {
            next(new Error((err as Error).message ?? 'Unable to logout'))
        }
    }

    public sendResetCode: RequestHandler = async (req, res, next) => {
        try {
            const { email } = req.body
            if (!email) {
                next(new BadRequest('Missing email'))
                return
            }

            await authService.sendPasswordResetCode(email)
            res.json({ message: 'Reset code sent if account exists' } as Return)
        } catch (err: unknown) {
            next(new BadRequest((err as Error).message ?? 'Unable to send reset code'))
        }
    }

    public resetPassword: RequestHandler = async (req, res, next) => {
        try {
            const { email, code, newPassword } = req.body
            if (!email || !code || !newPassword) {
                next(new BadRequest('Missing fields'))
                return
            }

            await authService.resetPassword(email, code, newPassword)
            res.json({ message: 'Password reset successful' } as Return)
        } catch (err: unknown) {
            next(new BadRequest((err as Error).message ?? 'Unable to reset password'))
        }
    }
}

export const authController = new AuthController()
