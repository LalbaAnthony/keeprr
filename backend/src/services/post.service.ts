import { Post } from '../models'
import { WhereOptions } from 'sequelize'
import { Pagination } from '../types/utils/pagination.types'
import { Transaction } from 'sequelize'
import { sequelize } from '../config/database'
import { Order } from '../types/utils/sort.types'
import { PostAttributes, PostAttributesCreation, PostAttributesUpdate } from '../types/models/post.types'
import { Op } from 'sequelize'

export class PostService {
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

    return Post.count({ where })
  }

  public async getAll(options: { search?: string; pagination: Pagination; order?: Order; }): Promise<PostAttributes[]> {
    const { order, pagination, search } = options
    const { offset, limit } = pagination

    let where: WhereOptions = {}

    where = this.search(where, search)

    return Post.findAll({ where, order, offset, limit })
  }

  public async getById(id: number): Promise<PostAttributes | null> {
    const post = await Post.findOne({ where: { id } })
    return post
  }

  public async create(data: PostAttributesCreation): Promise<PostAttributes | null> {
    return sequelize.transaction(async (t: Transaction) => {
      const post = await Post.create(data, { transaction: t })
      return post
    }).then(async (post) => {
      return await this.getById(post.id)
    })
  }

  public async update(id: number, data: PostAttributesUpdate): Promise<PostAttributes | null> {
    return sequelize.transaction(async (t: Transaction) => {
      await Post.update(data, { where: { id }, transaction: t })
    }).then(async () => {
      return this.getById(id)
    })
  }

  public async delete(id: number): Promise<number> {
    const result = await Post.destroy({ where: { id } })
    return result
  }
}

export const postService = new PostService()
