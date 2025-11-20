import { authService } from '../src/services/auth.service'
import { AuthRefreshToken, AuthPasswordResetToken } from '../src/models'
import { userService } from '../src/services/user.service'
import * as passwordUtils from '../src/utils/password.utils'
import * as jwtUtils from '../src/utils/jwt.utils'
import * as authUtils from '../src/utils/auth.utils'
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { UserStatus } from '../src/types/models/user.types'

jest.mock('../src/models')
jest.mock('../src/services/user.service')
jest.mock('../src/utils/password.utils')
jest.mock('../src/utils/jwt.utils')
jest.mock('../src/utils/auth.utils')

const mockedUserService = userService as jest.Mocked<typeof userService>
const mockedPasswordUtils = passwordUtils as jest.Mocked<typeof passwordUtils>
const mockedJwtUtils = jwtUtils as jest.Mocked<typeof jwtUtils>
const mockedAuthUtils = authUtils as jest.Mocked<typeof authUtils>
const mockedAuthRefreshToken = AuthRefreshToken as jest.Mocked<typeof AuthRefreshToken>
const mockedAuthPasswordResetToken = AuthPasswordResetToken as jest.Mocked<typeof AuthPasswordResetToken>

const mockUser = {
    id: 1,
    email: 'john@example.com',
    username: 'johnny',
    first_name: 'John',
    last_name: 'Doe',
    password: 'hashed123',
    status: 'active' as UserStatus,
    created_at: new Date(),
    updated_at: new Date()
}

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })


    describe('register', () => {
        it('should create a new user successfully', async () => {
            mockedUserService.getByEmail.mockResolvedValue(null)
            mockedUserService.getByUsername.mockResolvedValue(null)
            mockedPasswordUtils.isStrongPassword.mockReturnValue(true)
            mockedPasswordUtils.hashPassword.mockResolvedValue('hashed_pw')
            mockedUserService.create.mockResolvedValue({ ...mockUser, password: 'hashed_pw' })

            const result = await authService.register({
                email: mockUser.email,
                username: mockUser.username,
                password: 'StrongPass123!',
                first_name: mockUser.first_name,
                last_name: mockUser.last_name,
                status: 'active',
            })

            expect(result.email).toBe(mockUser.email)
            expect(mockedUserService.create).toHaveBeenCalled()
        })

        it('should throw if email already exists', async () => {
            mockedUserService.getByEmail.mockResolvedValue(mockUser)

            await expect(
                authService.register({
                    email: mockUser.email,
                    username: mockUser.username,
                    password: 'StrongPass123!',
                    first_name: mockUser.first_name,
                    last_name: mockUser.last_name,
                    status: 'active',
                })
            ).rejects.toThrow('Email already in use')
        })
    })


    describe('login', () => {
        it('should login successfully and return tokens', async () => {
            mockedUserService.getByEmail.mockResolvedValue(mockUser)
            mockedPasswordUtils.comparePassword.mockResolvedValue(true)
            mockedJwtUtils.signAccessToken.mockReturnValue('access_token')
            mockedAuthUtils.randomTokenString.mockReturnValue('refresh_token')
            mockedAuthRefreshToken.create.mockResolvedValue({})

            const result = await authService.login(mockUser.email, 'password')

            expect(result.accessToken).toBe('access_token')
            expect(result.refreshToken).toBe('refresh_token')
            expect(mockedAuthRefreshToken.create).toHaveBeenCalled()
        })

        it('should throw on invalid password', async () => {
            mockedUserService.getByEmail.mockResolvedValue(mockUser)
            mockedPasswordUtils.comparePassword.mockResolvedValue(false)

            await expect(authService.login(mockUser.email, 'wrongpass')).rejects.toThrow('Invalid credentials')
        })
    })


    describe('refreshToken', () => {
        const mockRefreshRecord = {
            token: 'old_token',
            expires_at: new Date(Date.now() + 10000),
            user_id: mockUser.id,
            destroy: jest.fn().mockResolvedValue(1 as never) // Changed from true to 1 cuz AuthRefreshToken.destroy returns number
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any // Cast to any to avoid type issues in tests (we only care about certain fields)

        it('should refresh tokens successfully', async () => {
            mockedAuthRefreshToken.findOne.mockResolvedValue(mockRefreshRecord)
            mockedUserService.getById.mockResolvedValue(mockUser)
            mockedAuthUtils.randomTokenString.mockReturnValue('new_refresh_token')
            mockedAuthRefreshToken.create.mockResolvedValue({})
            mockedJwtUtils.signAccessToken.mockReturnValue('new_access_token')

            const result = await authService.refreshToken('old_token')

            expect(result.accessToken).toBe('new_access_token')
            expect(result.refreshToken).toBe('new_refresh_token')
            expect(mockRefreshRecord.destroy).toHaveBeenCalled()
        })

        it('should throw if refresh token not found', async () => {
            mockedAuthRefreshToken.findOne.mockResolvedValue(null)

            await expect(authService.refreshToken('invalid')).rejects.toThrow('Invalid refresh token')
        })
    })


    describe('logout', () => {
        it('should delete refresh token successfully', async () => {
            mockedAuthRefreshToken.destroy.mockResolvedValue(1)

            const result = await authService.logout('token')

            expect(result).toBe(true)
            expect(mockedAuthRefreshToken.destroy).toHaveBeenCalled()
        })
    })


    describe('sendPasswordResetCode', () => {
        it('should send reset code', async () => {
            mockedUserService.getByEmail.mockResolvedValue(mockUser)
            mockedAuthUtils.randomNumericCode.mockReturnValue('123456')
            mockedPasswordUtils.hashPassword.mockResolvedValue('hashed_code')
            mockedAuthPasswordResetToken.create.mockResolvedValue({})

            const result = await authService.sendPasswordResetCode(mockUser.email)

            expect(result).toBe(true)
        })

        it('should throw if user not found', async () => {
            mockedUserService.getByEmail.mockResolvedValue(null)

            await expect(authService.sendPasswordResetCode('missing@mail.com')).rejects.toThrow(Error('User not found'))
        })
    })
})
