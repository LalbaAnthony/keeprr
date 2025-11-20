export class GlobalError extends Error 
{
    public code: number

    constructor(message: string, code: number = 500) {
        super(message)
        this.code = code
        Object.setPrototypeOf(this, GlobalError.prototype) // Restores prototype chain
    }
}