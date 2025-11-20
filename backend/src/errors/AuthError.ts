import { GlobalError } from './GlobalError'

export class AuthError extends GlobalError {}

export class Unauthorized extends AuthError {
    constructor(message = 'Unauthorized') {
        super(message, 401)
    }
}

export class Forbidden extends AuthError {
    constructor(message = 'Forbidden') {
        super(message, 403)
    }
}