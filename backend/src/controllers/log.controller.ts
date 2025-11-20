import { RequestHandler } from 'express'
import { logService } from '../services/log.service'
import { Return } from '../types/utils/api.types'
import { parseOrder } from '../utils/sort.util'
import { BadRequest, NotFound } from '../errors/HttpError'
import { paginate } from '../utils/pagination.util'

export class LogController {
  public getAll: RequestHandler = async (req, res, next) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const order = parseOrder(req)

    try {
      const options = { search }

      const count = await logService.count(options)
      const pagination = paginate(page, limit, count)
      const data = await logService.getAll({ pagination, order, ...options })

      res.json({ pagination, data, message: 'Logs retrieved successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new Error((err as Error).message ?? 'Unable to retrieve logs'))
    }
  }

  public getById: RequestHandler<{ id: string }> = async (req, res, next) => {
    const id = Number(req.params.id)
    
    try {
      const log = await logService.getById(id)
      res.json({ data: [log], message: 'Log retrieved successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new NotFound((err as Error).message ?? 'Log not found'))
    }
  }

  public clear: RequestHandler = async (req, res, next) => {
    try {
      const deletedCount = await logService.clear()
      res.json({ message: `Cleared ${deletedCount} logs older than retention period` } as Return)
    } catch (err: Error | unknown) {
      next(new BadRequest((err as Error).message ?? 'Invalid request'))
    }
  }
}

export const logController = new LogController()
