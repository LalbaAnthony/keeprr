import { DataTypes, Model, Sequelize } from 'sequelize'
import { AuthRefreshTokenAttributes } from '../types/models/authRefreshToken.types'

export class AuthRefreshToken extends Model<AuthRefreshTokenAttributes> implements AuthRefreshTokenAttributes {
    public id!: number
    public token!: string
    public user_id!: number
    public expires_at!: Date

    public readonly created_at!: Date
    public readonly updated_at!: Date
}

export function initAuthRefreshTokenModel(sequelize: Sequelize) {
    AuthRefreshToken.init({
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        token: {
            type: DataTypes.STRING(500),
            allowNull: false,
            unique: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
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
        tableName: 'refresh_token',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['user_id'] },
            { fields: ['token'] }
        ]
    })
}
