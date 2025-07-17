import { Tool, ToolResponse } from '../../types/chat.types'

export abstract class BaseTool implements Tool {
    abstract name: string
    abstract description: string
    abstract pattern: RegExp
    abstract execute(
        input: string,
        match: RegExpMatchArray
    ): Promise<ToolResponse>

    protected createSuccessResponse(data: string): ToolResponse {
        return { success: true, data }
    }

    protected createErrorResponse(error: string): ToolResponse {
        return { success: false, error }
    }
}
