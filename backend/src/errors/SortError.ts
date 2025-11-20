import { GlobalError } from './GlobalError'

export class SortError extends GlobalError {}

export class InvalidSort extends SortError {
    constructor(message = 'Invalid Sort') {
        super(message, 400)
    }
}