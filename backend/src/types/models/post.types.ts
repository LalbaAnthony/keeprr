import { Optional } from 'sequelize'

export type PostType = 'blog' | 'event' | 'news' | 'page'

export type PostStatus = 'draft' | 'published' | 'archived'

export interface PostAttributes {
    id: number
    title: string
    content: string
    created_at?: Date | null
    updated_at?: Date | null
}

export type PostAttributesCreation = Optional<PostAttributes, 'id' | 'created_at' | 'updated_at'>

export type PostAttributesUpdate = Optional<PostAttributes, 'id' | 'created_at' | 'updated_at' | 'title' | 'content'>

