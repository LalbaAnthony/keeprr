import { sequelize } from '../src/config/database'
import { describe, it, expect} from '@jest/globals'

describe('Test Database Connection', () => {
    it('should connect to the database', async () => {
        expect(sequelize).toBeDefined()
    })

    // Perform a simple query to check if the database is responsive
    it('should execute a simple query', async () => {
        const [results] = await sequelize.query('SELECT 1 + 1 AS result')
        const typedResults = results as Array<{ result: number }>
        expect(typedResults).toBeDefined()
        expect(typedResults[0].result).toBe(2)
    })
})
