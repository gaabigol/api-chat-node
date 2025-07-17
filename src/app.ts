import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import { ChatService } from './service/chat.service'
import { ChatMessageRequest } from './dto/chatMessageRequest'
import { ValidationChecker } from './shared/utils/validationChecker'
import { HttpError } from './shared/exceptions/httpError'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(
    cors({
        origin: ['http://localhost:4200', 'https://bysix-angular.vercel.app'],
        methods: ['POST', 'OPTIONS', 'GET'],
    })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/chat', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestDto = new ChatMessageRequest(req.body)
        ValidationChecker.validate(requestDto, next)
        const chatService = new ChatService()
        const { message } = req.body
        const response = await chatService.sendMessage(message)

        res.json({
            message: response,
        })
    } catch (error) {
        next(error)
    }
})

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (!(error instanceof Error)) {
        return next(error)
    }
    console.error(error)

    if (error instanceof SyntaxError) {
        return res.status(400).send({
            title: 'Bad Request',
            status: 400,
            detail: error.message,
        })
    }

    if (error instanceof HttpError) {
        return res.status(422).send(error.toJSON())
    }

    res.status(500).send({
        title: 'Internal Server Error',
        status: 500,
        detail: 'An unexpected error occurred',
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
