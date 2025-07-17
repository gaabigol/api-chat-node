import { ToolResponse } from '../types/chat.types'
import { BaseTool } from './base/baseTools'

export class CalculatorTool extends BaseTool {
    name = 'calculator'
    description = 'Perform basic mathematical calculations'
    pattern =
        /(?:calculate|calcular|compute|what is|quanto é)\s+([0-9+\-*/.() ]+)/i

    async execute(
        input: string,
        match: RegExpMatchArray
    ): Promise<ToolResponse> {
        try {
            const expression = match[1].trim()
            console.log(`[CALCULATOR TOOL] Calculating: ${expression}`)

            const sanitizedExpression = expression.replace(
                /[^0-9+\-*/.() ]/g,
                ''
            )

            if (!sanitizedExpression) {
                return this.createErrorResponse(
                    'Invalid mathematical expression.'
                )
            }

            const result = eval(sanitizedExpression)

            if (isNaN(result) || !isFinite(result)) {
                return this.createErrorResponse('Invalid calculation result.')
            }

            const calculationResult = `**Calculation Result**

            **Expression**: ${expression}
            **Result**: ${result}`

            return this.createSuccessResponse(calculationResult)
        } catch (error) {
            console.error('Calculator Tool Error:', error)
            return this.createErrorResponse(
                `Sorry, I couldn't calculate "${match[1]}". Please check your expression.`
            )
        }
    }
}
