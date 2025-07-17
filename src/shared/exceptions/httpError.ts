export abstract class HttpError extends Error {
    constructor(
        public readonly statusCode: number,
        public override readonly message: string,
        public override readonly name: string = 'HttpError'
    ) {
        super(message)
        this.name = name
        Error.captureStackTrace(this, this.constructor)
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            title: this.name,
        }
    }
}
