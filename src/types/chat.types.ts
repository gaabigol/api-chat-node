export interface ToolResponse {
    success: boolean
    data?: string
    error?: string
}

export interface Tool {
    name: string
    description: string
    pattern: RegExp
    execute: (input: string, match: RegExpMatchArray) => Promise<ToolResponse>
}

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
    timestamp?: Date
}
