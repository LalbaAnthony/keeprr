import { Log } from '../models'
import { LogAttributesCreation } from '../types/models/log.types'
import { WhereOptions } from 'sequelize'
import { Op } from 'sequelize'
import { Pagination } from '../types/utils/pagination.types'
import { Request } from 'express'
import { Order } from '../types/utils/sort.types'

export class LogService {
  public logRetentionDays = 30

  private filterSearch(where: WhereOptions = {}, search: string = ''): WhereOptions {
    if (!search) return where
    if (typeof search !== 'string' || search.trim().length < 2) return where

    return {
      ...where,
      [Op.or]: [
        { message: { [Op.like]: `%${search}%` } },
        { context: { [Op.like]: `%${search}%` } },
        { user_agent: { [Op.like]: `%${search}%` } },
        { ip_address: { [Op.like]: `%${search}%` } },
      ],
    }
  }

  public async count(options: { search?: string }): Promise<number> {
    const { search } = options

    let where: WhereOptions = {}
    where = this.filterSearch(where, search)

    return Log.count({ where })
  }

  public async getAll(options: { search?: string; pagination: Pagination; order?: Order }): Promise<Log[]> {
    const { order, pagination, search } = options
    const { offset, limit } = pagination

    let where: WhereOptions = {}
    where = this.filterSearch(where, search)

    return Log.findAll({ where, order, offset, limit })
  }

  public async getById(id: number): Promise<Log | null> {
    const log = await Log.findOne({ where: { id } })
    return log
  }

  // ? Main method to create a log entry
  // ? Should be called from anywhere in the application where logging is needed
  // ? Avoid meaningless logs by ensuring the message is clear and concise. Log only what is necessary.
  public async make(message: string, level: LogAttributesCreation['level'] = 'info', req?: Request): Promise<Log> {
    const data: LogAttributesCreation = {
      message,
      level,
    }

    if (req) {
      data.user_agent = req.headers['user-agent']
      data.ip_address = req.ip || req.connection.remoteAddress || ''
      data.user_id = Number(req?.params?.user_id || 0) || null
      data.context = {
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params
      }
    }

    const log = await this.create(data)

    return log
  }

  private async create(data: LogAttributesCreation): Promise<Log> {
    const log = await Log.create(data)
    return log
  }

  private async update(): Promise<Log | null> {
    // ! THIS METHOD SHOULD NEVER BE IMPLEMENTED
    // ! BEING ABLE TO UPDATE LOGS DEFEATS THE PURPOSE OF HAVING LOGS
    throw new Error('Method not implemented.')
  }

  private async delete(): Promise<Log | null> {
    // ! THIS METHOD SHOULD NEVER BE IMPLEMENTED
    // ! BEING ABLE TO DELETE LOGS DEFEATS THE PURPOSE OF HAVING LOGS
    throw new Error('Method not implemented.')
  }

  public async clear(): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - this.logRetentionDays)

    const result = await Log.destroy({
      where: {
        created_at: {
          [Op.lt]: cutoffDate,
        },
      },
    })

    return result
  }
}

export const logService = new LogService()
