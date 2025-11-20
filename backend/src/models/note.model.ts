import { DataTypes, Model, Sequelize } from 'sequelize'
import { NoteAttributes, NoteAttributesCreation } from '../types/models/note.types'

export class Note extends Model<NoteAttributes, NoteAttributesCreation> implements NoteAttributes {
  public id!: number
  public user_id!: number
  public title!: string
  public content!: string

  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initNoteModel(sequelize: Sequelize) {
  Note.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'user_id'
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
    tableName: 'note',
    underscored: true,
  })
}