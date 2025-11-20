import { Optional } from 'sequelize'

export type LogLevel = 'emergency' | 'alert' | 'critical' | 'error' | 'warning' | 'notice' | 'info' | 'debug'

export interface LogAttributes {
    id: number
    level: LogLevel
    message: string
    context?: object | null
    user_id?: number | null
    ip_address?: string | null
    user_agent?: string | null
    created_at?: Date | null
    updated_at?: Date | null
}

export type LogAttributesCreation = Optional<LogAttributes, 'id' | 'created_at' | 'updated_at'>
