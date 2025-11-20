import { RequestHandler } from 'express'
import { userService } from '../services/user.service'
import { Return } from '../types/utils/api.types'
import { BadRequest, NotFound } from '../errors/HttpError'

export class UserController {
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
