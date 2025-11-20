import request from 'supertest'
import app from '../src/app'
import { expect, describe, it } from '@jest/globals'

describe('GET /health', () => {
    it('should return 200 OK', async () => {
        const response = await request(app).get('/health')
        expect(response.status).toBe(200)
    })
})
