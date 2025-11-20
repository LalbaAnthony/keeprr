import { DataTypes, Model, Sequelize } from 'sequelize'
import { AuthPasswordResetTokenAttributes } from '../types/models/authPasswordResetToken.types'

export class AuthPasswordResetToken extends Model<AuthPasswordResetTokenAttributes> implements AuthPasswordResetTokenAttributes {
    public id!: number
    public user_id!: number
    public code_hash!: string
    public expires_at!: Date
    public used!: boolean

    public readonly created_at!: Date
    public readonly updated_at!: Date
}

export function initAuthPasswordResetTokenModel(sequelize: Sequelize) {
    AuthPasswordResetToken.init({
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        code_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        used: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
        tableName: 'password_reset_token',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['user_id'] },
            { fields: ['used'] }
        ]
    })
}
