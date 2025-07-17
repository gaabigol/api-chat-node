import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import { ChatService } from './service/chat.service'
import { ChatMessageRequest } from './dto/chatMessageRequest'
import { ValidationChecker } from './shared/utils/validationChecker'
import { HttpError } from './shared/exceptions/httpError'
import cors from 'cors'

dotenv.config()

const app = express()

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://bysix-angular.vercel.app'] 
        : ['http://localhost:4200', 'http://localhost:3000']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', (req: Request, res: Response) => {
    res.json({ 
        message: 'API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    })
})



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
    console.error('Error:', error)

    if (error instanceof SyntaxError) {
        return res.status(400).json({
            title: 'Bad Request',
            status: 400,
            detail: error.message,
        })
    }

    if (error instanceof HttpError) {
        return res.status(422).json(error.toJSON())
    }

    res.status(500).json({
        title: 'Internal Server Error',
        status: 500,
        detail: 'An unexpected error occurred',
    })
})




if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}


export default app