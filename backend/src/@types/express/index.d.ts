import { UserAttributesPublic } from '../../types/models/user.types'

declare global {
    namespace Express {
        interface Request {
            user?: UserAttributesPublic
        }
    }
}

export { }
