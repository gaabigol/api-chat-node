import { ToolResponse } from '../types/chat.types'
import { BaseTool } from './base/baseTools'

export class TimezoneTool extends BaseTool {
    name = 'timezone'
    description = 'Get current time in different cities'
    pattern = /(?:time|hora|horário).*?(?:in|em|de|para)\s+([^?.!]+)/i

    async execute(
        input: string,
        match: RegExpMatchArray
    ): Promise<ToolResponse> {
        try {
            const city = match[1].trim()
            console.log(`[TIME TOOL] Getting time for: ${city}`)

            const now = new Date()
            const timeString = now.toLocaleString('pt-BR', {
                timeZone: 'Europe/Lisbon', // Placeholder timezone
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            })

            const timeInfo = `
            **Current time in ${city}**
            **Date & Time**: ${timeString}
            **Timezone**: Europe/Lisbon*`

            return this.createSuccessResponse(timeInfo)
        } catch (error) {
            console.error('Time Tool Error:', error)
            return this.createErrorResponse(
                `Sorry, I couldn't get the time for "${match[1]}".`
            )
        }
    }
}
