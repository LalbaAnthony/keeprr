import { DataTypes, Model, Sequelize } from 'sequelize'
import { PostAttributes, PostAttributesCreation } from '../types/models/post.types'

export class Post extends Model<PostAttributes, PostAttributesCreation> implements PostAttributes {
  public id!: number
  public title!: string
  public content!: string

  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initPostModel(sequelize: Sequelize) {
  Post.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    title: DataTypes.STRING(500),
    content: DataTypes.TEXT,
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
    tableName: 'post',
    underscored: true,
  })
}