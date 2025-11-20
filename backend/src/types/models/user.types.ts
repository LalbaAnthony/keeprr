import { Optional } from 'sequelize'

export type UserStatus = 'active' | 'inactive' | 'banned'

export interface UserAttributes {
    id: number
    email: string
    password?: string
    username: string
    first_name?: string | null
    last_name?: string | null
    phone?: string | null
    birth_date?: Date | null
    avatar_url?: string | null
    email_verified_at?: Date | null
    status: UserStatus
    created_at: Date
    updated_at: Date
}

export type UserAttributesPublic = Pick<UserAttributes, 'id' | 'email' | 'username' >

export type UserAttributesCreation = Optional<UserAttributes, 'id' | 'created_at' | 'updated_at'>

export type UserAttributesUpdate = Optional<UserAttributes, 'id' | 'created_at' | 'updated_at' | 'email' | 'password' | 'username' | 'first_name' | 'last_name' | 'phone' | 'birth_date' | 'avatar_url' | 'email_verified_at' | 'status' | >
