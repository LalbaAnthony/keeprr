import { RequestHandler } from 'express'
import { postService } from '../services/post.service'
import { Return } from '../types/utils/api.types'
import { parseOrder } from '../utils/sort.util'
import { BadRequest, NotFound } from '../errors/HttpError'
import { paginate } from '../utils/pagination.util'

export class PostController {
  public getAll: RequestHandler = async (req, res, next) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const order = parseOrder(req)

    try {
      const options = { search }

      const count = await postService.count(options)
      const pagination = paginate(page, limit, count)
      const data = await postService.getAll({ pagination, order, ...options })

      res.json({ pagination, data, message: 'Posts retrieved successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new Error((err as Error).message ?? 'Unable to retrieve posts'))
    }
  }

  public getById: RequestHandler<{ id: string }> = async (req, res, next) => {
    const id = Number(req.params.id)
    try {
      const post = await postService.getById(id)

      res.json({ data: [post], message: 'Post retrieved successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new NotFound((err as Error).message ?? 'Post not found'))
    }
  }

  public create: RequestHandler = async (req, res, next) => {
    try {
      const post = await postService.create(req.body)

      res.status(201).json({ data: [post], message: 'Post created successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new BadRequest((err as Error).message ?? 'Invalid request'))
    }
  }

  public update: RequestHandler<{ id: string }> = async (req, res, next) => {
    const id = Number(req.params.id)
    try {
      const post = await postService.update(id, req.body)
      res.status(200).json({ data: [post], message: 'Post updated successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new BadRequest((err as Error).message ?? 'Invalid request'))
    }
  }

  public delete: RequestHandler<{ id: string }> = async (req, res, next) => {
    const id = Number(req.params.id)
    try {
      await postService.delete(id)
      res.status(200).json({ message: 'Post deleted successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new NotFound((err as Error).message ?? 'Post not found'))
    }
  }
}

export const postController = new PostController()
