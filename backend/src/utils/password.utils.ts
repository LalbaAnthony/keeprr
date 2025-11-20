import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const SALT_ROUNDS = Number(process.env.BACKEND_BCRYPT_SALT_ROUNDS ?? 12)

export async function hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS)
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash)
}

export function isHash(str: string): boolean {
    return str.startsWith('$2b$') && str.length === 60
}

/**
 * Check if a password is strong enough.
 * @param password string to test
 * @param scoreMin minimum score to be considered strong
 * @returns true if strong, false otherwise
 */
export function isStrongPassword(password: string, scoreMin: number = 8): boolean | number {
    let score = 0
    if (password.length >= 8) score += 2
    if (password.length >= 12) score += 1
    if (/[A-Z]/.test(password)) score += 2 // uppercase
    if (/[a-z]/.test(password)) score += 2 // lowercase
    if (/[0-9]/.test(password)) score += 2 // number
    if (/[^A-Za-z0-9]/.test(password)) score += 1 // special char

    return score >= scoreMin
}