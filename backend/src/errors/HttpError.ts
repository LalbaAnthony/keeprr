import { GlobalError } from './GlobalError'

export class HttpError extends GlobalError {}

export class BadRequest extends HttpError {
    constructor(message = 'Bad Request') {
        super(message, 400)
    }
}

export class NotFound extends HttpError {
    constructor(message = 'Not Found') {
        super(message, 404)
    }
}

