import { Request } from 'express'
import { Order } from '../types/utils/sort.types'
import { InvalidSort } from '../errors/SortError'

const DEFAULT_ORDER: Order = [['created_at', 'DESC'], ['id', 'DESC']]

export const parseOrder = (req?: Request): Order => {
    if (!req) return DEFAULT_ORDER

    const sortParam = req.query?.sort

    if (!sortParam) {
        return DEFAULT_ORDER
    }

    try {
        let parsed: unknown

        // Handle both JSON and colon-based syntax (e.g., "name:asc")
        if (typeof sortParam === 'string' && !sortParam.trim().startsWith('[')) {
            // Example: sort=name:asc,id:desc
            parsed = sortParam.split(',').map((pair) => {
                const [field, dir] = pair.split(':').map((s) => s.trim())
                return [field, (dir || 'ASC').toUpperCase()] as [string, string]
            })
        } else {
            parsed = JSON.parse(sortParam.toString())
        }

        if (Array.isArray(parsed)) {
            const cleaned: Order = []

            for (const item of parsed) {
                if (Array.isArray(item) && item.length === 2) {
                    const [field, dir] = item
                    if (
                        typeof field === 'string' &&
                        typeof dir === 'string' &&
                        ['ASC', 'DESC'].includes(dir.toUpperCase())
                    ) {
                        cleaned.push([field, dir.toUpperCase() as 'ASC' | 'DESC'])
                    }
                }
            }

            if (cleaned.length > 0) {
                return cleaned
            }
        }
    } catch (error) {
        throw new InvalidSort((error as Error).message ?? 'Sort parsing error')
    }

    return DEFAULT_ORDER
}

