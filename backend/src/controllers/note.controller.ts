import { RequestHandler } from 'express'
import { noteService } from '../services/note.service'
import { Return } from '../types/utils/api.types'
import { parseOrder } from '../utils/sort.util'
import { BadRequest, NotFound } from '../errors/HttpError'
import { paginate } from '../utils/pagination.util'

export class NoteController {
  public getAll: RequestHandler = async (req, res, next) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = String(req.query.search || '')
    const order = parseOrder(req)

    try {
      const options = { search }

      const count = await noteService.count(options)
      const pagination = paginate(page, limit, count)
      const data = await noteService.getAll({ pagination, order, ...options })

      res.json({ pagination, data, message: 'Notes retrieved successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new Error((err as Error).message ?? 'Unable to retrieve notes'))
    }
  }

  public getById: RequestHandler<{ id: string }> = async (req, res, next) => {
    const id = Number(req.params.id)
    try {
      const note = await noteService.getById(id)

      res.json({ data: [note], message: 'Note retrieved successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new NotFound((err as Error).message ?? 'Note not found'))
    }
  }

  public create: RequestHandler = async (req, res, next) => {
    try {
      const note = await noteService.create(req.body)

      res.status(201).json({ data: [note], message: 'Note created successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new BadRequest((err as Error).message ?? 'Invalid request'))
    }
  }

  public update: RequestHandler<{ id: string }> = async (req, res, next) => {
    const id = Number(req.params.id)
    try {
      const note = await noteService.update(id, req.body)
      res.status(200).json({ data: [note], message: 'Note updated successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new BadRequest((err as Error).message ?? 'Invalid request'))
    }
  }

  public delete: RequestHandler<{ id: string }> = async (req, res, next) => {
    const id = Number(req.params.id)
    try {
      await noteService.delete(id)
      res.status(200).json({ message: 'Note deleted successfully' } as Return)
    } catch (err: Error | unknown) {
      next(new NotFound((err as Error).message ?? 'Note not found'))
    }
  }
}

export const noteController = new NoteController()
