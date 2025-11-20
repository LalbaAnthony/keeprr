import { DataTypes, Model, Sequelize } from 'sequelize'
import { UserAttributes, UserAttributesCreation, UserStatus } from '../types/models/user.types'

export class User extends Model<UserAttributes, UserAttributesCreation> implements UserAttributes {
  public id!: number
  public email!: string
  public password!: string
  public username!: string
  public first_name?: string
  public last_name?: string
  public phone?: string
  public birth_date?: Date
  public avatar_url?: string
  public email_verified_at?: Date
  public status!: UserStatus

  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initUserModel(sequelize: Sequelize) {
  User.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    first_name: DataTypes.STRING(100),
    last_name: DataTypes.STRING(100),
    phone: DataTypes.STRING(20),
    birth_date: DataTypes.DATEONLY,
    avatar_url: DataTypes.STRING(500),
    email_verified_at: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'banned'),
      defaultValue: 'active'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'user',
    underscored: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['username'] },
      { fields: ['status'] }
    ]
  })
}