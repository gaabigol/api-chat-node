import { ValidationError } from 'class-validator'
import { HttpError } from './httpError'

export class UnprocessableEntityException extends HttpError {
    constructor(
        message = 'Unprocessable Entity',
        readonly error: ValidationError[]
    ) {
        super(422, message, 'Unprocessable Entity Exception')
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            title: this.name,
            detail: {
                errors: this.error.map((e) => ({
                    field: e.property,
                    constraints: e.constraints,
                })),
            },
        }
    }
}
