import { Optional } from 'sequelize'

export interface NoteAttributes {
    id: number
    user_id: number
    title: string
    content: string
    created_at?: Date | null
    updated_at?: Date | null
}

export type NoteAttributesCreation = Optional<NoteAttributes, 'id' | 'created_at' | 'updated_at'>

export type NoteAttributesUpdate = Optional<NoteAttributes, 'id' | 'created_at' | 'updated_at' | 'title' | 'content'>

