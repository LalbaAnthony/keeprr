import crypto from 'crypto' 

export function randomTokenString(bytes: number = 48): string {
    return crypto.randomBytes(bytes).toString('hex')
}

export function randomNumericCode(length: number = 6): string {
    const min = 10 ** (length - 1)
    const max = 10 ** length - 1
    return String(Math.floor(Math.random() * (max - min + 1) + min))
}