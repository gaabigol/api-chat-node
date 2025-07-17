import { IsString, MinLength } from 'class-validator'

export class ChatMessageRequest {
    @IsString()
    @MinLength(3)
    message!: string

    constructor(data: any) {
        this.message = data.message || ''
    }
}
