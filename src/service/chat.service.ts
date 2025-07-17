import { ChatOpenAI } from '@langchain/openai'
import {
    HumanMessage,
    SystemMessage,
    AIMessage,
} from '@langchain/core/messages'

import { ChatMessage } from '../types/chat.types'
import { ToolManager } from '../tools/managerTools'

export class ChatService {
    private model: ChatOpenAI
    private toolManager: ToolManager
    private messages: any[] = []
    private conversationHistory: ChatMessage[] = []

    constructor() {
        this.model = new ChatOpenAI({
            temperature: 0.7,
            modelName: 'gpt-4',
            openAIApiKey: process.env.OPENAI_API_KEY,
            maxRetries: 3,
            timeout: 30000,
        })

        this.toolManager = new ToolManager()
        this.initializeSystemMessage()
    }

    private initializeSystemMessage(): void {
        const availableTools = this.toolManager.getAvailableTools()

        const systemMessage = new SystemMessage(`
        Your name is Miguel Bernardo. You are a helpful and intelligent chatbot.

        CAPABILITIES:
        You have access to the following tools:
        ${availableTools.map((tool) => `- ${tool}`).join('\n')}

        INSTRUCTIONS:
        - For general questions, respond normally in a friendly and helpful manner
        - You can have conversations about any topic
        - Be engaging, informative, and maintain context throughout the conversation
        - If users ask about your capabilities, mention the tools you have available
        - Always be polite and professional

        PERSONALITY:
        - Friendly and approachable
        - Knowledgeable but not condescending  
        - Helpful and patient
        - Maintain conversation flow naturally

        Remember: You are an AI assistant named Miguel Bernardo who can help with various tasks and have natural conversations.`)

        this.messages.push(systemMessage)
    }

    public async sendMessage(userMessage: string): Promise<string> {
        try {
            console.log(`\n💬 [CHAT SERVICE] User message: "${userMessage}"`)

            this.addToHistory('user', userMessage)
            this.messages.push(new HumanMessage(userMessage))

            const toolResponse = await this.toolManager.processTool(userMessage)

            if (toolResponse) {
                console.log(`[CHAT SERVICE] Tool handled the request`)
                this.addToHistory('assistant', toolResponse)
                this.messages.push(new AIMessage(toolResponse))
                return toolResponse
            }

            console.log(`[CHAT SERVICE] Using LLM for general conversation`)
            const response = await this.model.invoke(this.messages)
            const finalResponse = response.content as string

            console.log(`[CHAT SERVICE] LLM Response: "${finalResponse}"`)

            this.addToHistory('assistant', finalResponse)
            this.messages.push(new AIMessage(finalResponse))

            return finalResponse
        } catch (error) {
            console.error('Chat Service Error:', error)
            const errorMessage =
                'Sorry, I encountered an error. Please try again.'
            this.addToHistory('assistant', errorMessage)
            return errorMessage
        }
    }

    private addToHistory(role: 'user' | 'assistant', content: string): void {
        this.conversationHistory.push({
            role,
            content,
            timestamp: new Date(),
        })
    }

    public getConversationHistory(): ChatMessage[] {
        return this.conversationHistory
    }

    public clearHistory(): void {
        this.conversationHistory = []
        this.messages = []
        this.initializeSystemMessage()
        console.log('[CHAT SERVICE] History cleared')
    }

    public getAvailableTools(): string[] {
        return this.toolManager.getAvailableTools()
    }
}
