import { AuthRefreshToken, AuthPasswordResetToken } from '../models'
import { sequelize } from '../config/database'
import { Op } from 'sequelize'
import { hashPassword, comparePassword } from '../utils/password.utils'
import { signAccessToken } from '../utils/jwt.utils'
import { randomTokenString, randomNumericCode } from '../utils/auth.utils'
import { isStrongPassword } from '../utils/password.utils'
import { isEmail } from '../utils/email.utils'
import { UserAttributesCreation } from '../types/models/user.types'
import { userService } from '../services/user.service'
import { NotFound } from '../errors/HttpError'

export class AuthService {
    public async register(payload: UserAttributesCreation) {
        const { email, password, username, status = 'active' } = payload

        if (!isEmail(email)) throw new Error('Invalid email')
        const existingEMail = await userService.getByEmail(email)
        if (existingEMail) throw new Error('Email already in use')

        const existingUsername = await userService.getByUsername(username)
        if (existingUsername) throw new Error('Username already in use')

        if (!password) throw new Error('Password is required')
        if (!isStrongPassword(password)) throw new Error('Too weak password')

        const hash = await hashPassword(password)
        const user = await userService.create({ email, password: hash, username, status })

        return {
            id: user.id,
            email: user.email,
            username: user.username,
        }
    }

    public async login(emailOrUsername: string, password: string) {
        const user = await userService.getByEmail(emailOrUsername)
        if (!user) throw new Error('Invalid credentials')
        if (!user.password) throw new Error('Invalid credentials')

        const passwordOk = await comparePassword(password, user.password)
        if (!passwordOk) throw new Error('Invalid credentials')

        // create tokens
        const accessToken = signAccessToken({
            user_id: user.id,
            email: user.email,
            username: user.username,
        })

        const refreshTokenString = randomTokenString(32)
        const expiresAt = new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)) // 30 days

        await AuthRefreshToken.create({
            token: refreshTokenString,
            user_id: user.id,
            expires_at: expiresAt
        })

        return {
            accessToken,
            refreshToken: refreshTokenString,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            }
        }
    }

    public async refreshToken(oldRefreshToken: string) {
        const record = await AuthRefreshToken.findOne({ where: { token: oldRefreshToken } })
        if (!record) throw new Error('Invalid refresh token')

        if (record.expires_at < new Date()) {
            // remove expired
            await record.destroy()
            throw new Error('Refresh token expired')
        }

        // load user
        const user = await userService.getById(record.user_id)
        if (!user) throw new NotFound('User not found')

        // optionally rotate: delete old token & issue new one
        await record.destroy()
        const newRefresh = randomTokenString(32)
        const expiresAt = new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)) // 30 days

        await AuthRefreshToken.create({
            token: newRefresh,
            user_id: user.id,
            expires_at: expiresAt
        })

        const accessToken = signAccessToken({
            user_id: user.id,
            email: user.email,
            username: user.username,
        })

        return { accessToken, refreshToken: newRefresh }
    }

    public async logout(refreshToken: string) {
        const deleted = await AuthRefreshToken.destroy({ where: { token: refreshToken } })
        return deleted > 0
    }

    public async sendPasswordResetCode(email: string) {
        const user = await userService.getByEmail(email)
        if (!user) throw new NotFound('User not found')

        const code = randomNumericCode(6)
        const codeHash = await hashPassword(code) // hash code before storing
        const expiresAt = new Date(Date.now() + (1000 * 60 * 15)) // 15 minutes

        // store token
        await AuthPasswordResetToken.create({
            user_id: user.id,
            code_hash: codeHash,
            expires_at: expiresAt,
            used: false
        })

        // TODO: send email with the code

        // For security, do not return code in API
        return true
    }

    public async resetPassword(email: string, code: string, newPassword: string) {
        const user = await userService.getByEmail(email)
        if (!user) throw new NotFound('User not found')

        // find not-used tokens for that user unexpired, order by created_at desc
        const token = await AuthPasswordResetToken.findOne({
            where: {
                user_id: user.id,
                used: false,
                expires_at: { [Op.gt]: new Date() }
            },
            order: [['created_at', 'DESC']]
        })

        if (!token) throw new Error('No valid reset token found')

        const match = await comparePassword(code, token.code_hash)
        if (!match) throw new Error('Invalid code')

        // mark used + update password inside a transaction
        await sequelize.transaction(async () => {
            await token.update({ used: true })
            const newHash = await hashPassword(newPassword)
            await userService.update(user.id, { password: newHash })
        })

        return true
    }

    public async revokeAllRefreshTokensForUser(user_id: number) {
        await AuthRefreshToken.destroy({ where: { user_id: user_id } })
        return true
    }
}

export const authService = new AuthService()
