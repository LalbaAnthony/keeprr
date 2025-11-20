import { Log } from '../src/models'
import { logService } from '../src/services/log.service'
import { describe, it, expect } from '@jest/globals'

describe('LogService', () => {
    it('should create a log entry', async () => {
        const log = await logService.make('This is a test log message', 'info')

        expect(log).toBeDefined()
        expect(Number(log.id)).toBeGreaterThan(0)
        expect(log.message).toBe('This is a test log message')
        expect(log.level).toBe('info')
    })

    it('should clear logs older than retention period', async () => {
        // Firstly clear any existing logs
        await Log.destroy({ where: {} })

        // Create a log entry with a created_at date older than retention period
        const oldDate = new Date()
        oldDate.setDate(oldDate.getDate() - (logService.logRetentionDays + 1))
        await Log.create({ message: 'Old log message', level: 'info', created_at: oldDate })

        const clearedCount = await logService.clear()
        expect(clearedCount).toBeGreaterThan(0)

        const remainingLogs = await Log.findAll()
        expect(remainingLogs.length).toBe(0)
    })
})
