import { DataTypes, Model, Sequelize } from 'sequelize'
import { LogAttributes, LogAttributesCreation, LogLevel } from '../types/models/log.types'

export class Log extends Model<LogAttributes, LogAttributesCreation> implements LogAttributes {
  public id!: number
  public level!: LogLevel
  public message!: string
  public context?: object
  public user_id?: number
  public ip_address?: string
  public user_agent?: string

  public readonly created_at!: Date
  public readonly updated_at!: Date
}

export function initLogModel(sequelize: Sequelize) {
  Log.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    level: {
      type: DataTypes.ENUM('emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    context: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    tableName: 'tl_log', // cant use `log` as table name, it's a reserved keyword in PG
    underscored: true,
    indexes: [
      { fields: ['level'] },
      { fields: ['created_at'] },
      { fields: ['user_id'] },
    ]
  })
}