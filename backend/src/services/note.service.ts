import { Note } from '../models'
import { WhereOptions } from 'sequelize'
import { Pagination } from '../types/utils/pagination.types'
import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { Order } from '../types/utils/sort.types'
import { NoteAttributes, NoteAttributesCreation, NoteAttributesUpdate } from '../types/models/note.types'
import { Op } from 'sequelize'

export class NoteService {
  private search(where: WhereOptions, search?: string): WhereOptions {
    if (search) {
      where = {
        ...where,
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { content: { [Op.iLike]: `%${search}%` } }
        ]
      }
    }

    return where
  }

  public async count(options: { search?: string; }): Promise<number> {
    const { search } = options

    let where: WhereOptions = {}

    where = this.search(where, search)

    return Note.count({ where })
  }

  public async getAll(options: { search?: string; pagination: Pagination; order?: Order; }): Promise<NoteAttributes[]> {
    const { order, pagination, search } = options
    const { offset, limit } = pagination

    let where: WhereOptions = {}

    where = this.search(where, search)

    return Note.findAll({ where, order, offset, limit })
  }

  public async getById(id: number): Promise<NoteAttributes | null> {
    const note = await Note.findOne({ where: { id } })
    return note
  }

  public async create(data: NoteAttributesCreation): Promise<NoteAttributes | null> {
    return sequelize.transaction(async (t: Transaction) => {
      const note = await Note.create(data, { transaction: t })
      return note
    }).then(async (note) => {
      return await this.getById(note.id)
    })
  }

  public async update(id: number, data: NoteAttributesUpdate): Promise<NoteAttributes | null> {
    return sequelize.transaction(async (t: Transaction) => {
      await Note.update(data, { where: { id }, transaction: t })
    }).then(async () => {
      return this.getById(id)
    })
  }

  public async delete(id: number): Promise<number> {
    const result = await Note.destroy({ where: { id } })
    return result
  }
}

export const noteService = new NoteService()
