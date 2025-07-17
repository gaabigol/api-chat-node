import { Tool } from '../types/chat.types'
import { CalculatorTool } from './calculatorTool'
import { TimezoneTool } from './timezoneTool'
import { WeatherTool } from './weathertool'

export class ToolManager {
    private tools: Tool[] = []

    constructor() {
        this.registerDefaultTools()
    }

    private registerDefaultTools(): void {
        this.registerTool(new WeatherTool())
        this.registerTool(new TimezoneTool())
        this.registerTool(new CalculatorTool())
   
    }

    public registerTool(tool: Tool): void {
        this.tools.push(tool)
        console.log(`[TOOL MANAGER] Registered tool: ${tool.name}`)
    }

    public async processTool(input: string): Promise<string | null> {
        console.log(
            `[TOOL MANAGER] Checking input for tool patterns: "${input}"`
        )

        for (const tool of this.tools) {
            const match = input.match(tool.pattern)
            if (match) {
                console.log(`[TOOL MANAGER] Tool matched: ${tool.name}`)

                const response = await tool.execute(input, match)

                if (response.success) {
                    return response.data!
                } else {
                    return response.error!
                }
            }
        }

        console.log(`[TOOL MANAGER] No tool matched for input`)
        return null
    }

    public getAvailableTools(): string[] {
        return this.tools.map((tool) => `${tool.name}: ${tool.description}`)
    }
}
