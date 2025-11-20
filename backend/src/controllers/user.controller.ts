import { RequestHandler } from 'express'
import { userService } from '../services/user.service'
import { Return } from '../types/utils/api.types'
import { parseOrder } from '../utils/sort.util'
import { BadRequest, NotFound } from '../errors/HttpError'
import { paginate } from '../utils/pagination.util'

export class UserController {
  public getAll: RequestHandler = async (req, res, next) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const order = parseOrder(req)

    try {
      const options = { search }

      const count = await userService.count(options)
      const pagination = paginate(page, limit, count)
      const data = await userService.getAll({ pagination, order, ...options })

      res.json({ pagination, data, message: 'Users retrieved successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new Error((err as Error).message ?? 'Unable to retrieve users'))
    }
  }

  public getById: RequestHandler<{ id: string }> = async (req, res, next) => {
    const id = Number(req.params.id)
    try {
      const user = await userService.getById(id)
      res.json({ data: [user], message: 'User retrieved successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new NotFound((err as Error).message ?? 'User not found'))
    }
  }

  public create: RequestHandler = async (req, res, next) => {
    try {
      const user = await userService.create(req.body)

      res.status(201).json({ data: [user], message: 'User created successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new BadRequest((err as Error).message ?? 'Invalid request'))
    }
  }

  public update: RequestHandler<{ id: string }> = async (req, res, next) => {
    const id = Number(req.params.id)
    try {
      const user = await userService.update(id, req.body)
      res.status(200).json({ data: [user], message: 'User updated successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new BadRequest((err as Error).message ?? 'Invalid request'))
    }
  }

  public delete: RequestHandler<{ id: string }> = async (req, res, next) => {
    const id = Number(req.params.id)
    try {
      await userService.delete(id)
      res.status(200).json({ message: 'User deleted successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new NotFound((err as Error).message ?? 'User not found'))
    }
  }
}

export const userController = new UserController()
