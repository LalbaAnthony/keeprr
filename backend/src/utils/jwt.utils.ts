import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AccessTokenPayload } from '../types/utils/jwt.types'

dotenv.config()

const JWT_SECRET: string = process.env.BACKEND_JWT_SECRET ?? 'please-change-this'
const JWT_EXPIRES: jwt.SignOptions['expiresIn'] = (process.env.BACKEND_JWT_EXPIRES as jwt.SignOptions['expiresIn']) ?? '15m'

export function signAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

export function verifyAccessToken<T = AccessTokenPayload>(token: string): T {
    return jwt.verify(token, JWT_SECRET) as T
}
