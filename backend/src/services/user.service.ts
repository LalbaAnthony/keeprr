import { User } from '../models'
import { WhereOptions } from 'sequelize'
import { Pagination } from '../types/utils/pagination.types'
import { Transaction } from 'sequelize'
import { UserStatus } from '../types/models/user.types'
import { sequelize } from '../config/database'
import { Order } from '../types/utils/sort.types'
import { Op } from 'sequelize'
import { UserAttributesCreation } from '../types/models/user.types'
import { UserAttributesUpdate } from '../types/models/user.types'
import { UserAttributes } from '../types/models/user.types'

export class UserService {
  private filterSearch(where: WhereOptions = {}, search: string = ''): WhereOptions {
    if (!search) return where
    if (typeof search !== 'string' || search.trim().length < 2) return where

    return {
      ...where,
      [Op.or]: [
        { email: { [Op.like]: `%${search}%` } },
        { username: { [Op.like]: `%${search}%` } },
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
      ],
    }
  }

  private filterStatus(where: WhereOptions = {}, status: UserStatus = 'active'): WhereOptions {
    if (!status) return where
    return { ...where, status }
  }

  public async count(options: { search?: string; status?: UserStatus }): Promise<number> {
    const { search, status = 'active' } = options

    let where: WhereOptions = {}
    where = this.filterSearch(where, search)
    where = this.filterStatus(where, status)

    return User.count({ where })
  }

  public async getAll(options: { search?: string; status?: UserStatus; pagination: Pagination; order?: Order }): Promise<UserAttributes[]> {
    const { order, pagination, search, status = 'active' } = options
    const { offset, limit } = pagination

    let where: WhereOptions = {}
    where = this.filterSearch(where, search)
    where = this.filterStatus(where, status)

    return User.findAll({ where, order, offset, limit })
  }

  public async getByEmailOrUsername(emailOrUsername: string, options: { status?: UserStatus } = {}): Promise<UserAttributes | null> {
    const { status = 'active' } = options

    let where: WhereOptions = {}
    where = this.filterStatus(where, status)

    const user = await User.findOne({
      where: {
        ...where,
        [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    })


    return user
  }

  public async getByUsername(username: string, options: { status?: UserStatus } = {}): Promise<UserAttributes | null> {
    const { status = 'active' } = options

    let where: WhereOptions = {}
    where = this.filterStatus(where, status)

    const user = await User.findOne({ where: { ...where, username } })

    return user
  }

  public async getByEmail(email: string, options: { status?: UserStatus } = {}): Promise<UserAttributes | null> {
    const { status = 'active' } = options

    let where: WhereOptions = {}
    where = this.filterStatus(where, status)

    const user = await User.findOne({ where: { ...where, email } })

    return user
  }

  public async getById(id: number, options: { status?: UserStatus } = {}): Promise<UserAttributes | null> {
    const { status = 'active' } = options

    let where: WhereOptions = {}
    where = this.filterStatus(where, status)

    const user = await User.findOne({ where: { ...where, id } })

    return user
  }

  public async create(data: UserAttributesCreation): Promise<UserAttributes> {
    return sequelize.transaction(async (t: Transaction) => {
      const user = await User.create(data, { transaction: t })
      return user
    })
  }

  public async update(id: number, data: UserAttributesUpdate): Promise<UserAttributes | null> {
    return sequelize.transaction(async (t: Transaction) => {
      const user = await User.findByPk(id, { transaction: t })
      if (!user) return null

      // Update user itself
      await user.update(data, { transaction: t })

      // Return the user with its updated data
      return this.getById(id)
    })
  }

  public async delete(id: number): Promise<number> {
    const result = await User.destroy({ where: { id } })

    return result
  }
}

export const userService = new UserService()
