import { ToolResponse } from '../types/chat.types'
import { BaseTool } from './base/baseTools'

export class JokeTool extends BaseTool {
    name = 'joke'
    description = 'Generate jokes, funny content, or entertaining responses'
    pattern =
        /(?:piada|joke|engraçado|funny|divertido|conta.*piada|faz.*rir|humor|cómico|anedota|gozar|brincadeira|algo.*divertido|ser.*divertido|entertain)/i

    async execute(
        input: string,
        match: RegExpMatchArray
    ): Promise<ToolResponse> {
        try {
            console.log(`[JOKE TOOL] Processing humor request: ${input}`)

            const jokeType = this.analyzeJokeRequest(input)
            const llmPrompt = this.generateJokePrompt(input, jokeType)
            const jokeResponse = `🎭 **Modo Divertido Ativado!**

${llmPrompt}

*Preparando algo engraçado para si...*`

            return this.createSuccessResponse(jokeResponse)
        } catch (error) {
            console.error('🔥 Joke Tool Error:', error)
            return this.createErrorResponse(
                'Desculpe, não consegui ativar o modo divertido. Que tal tentarmos de novo?'
            )
        }
    }

    private analyzeJokeRequest(input: string): string {
        const lowerInput = input.toLowerCase()

        if (
            lowerInput.includes('carro') ||
            lowerInput.includes('automóvel') ||
            lowerInput.includes('veículo') ||
            lowerInput.includes('auto')
        ) {
            return 'automotive'
        }

        if (
            lowerInput.includes('piada') ||
            lowerInput.includes('anedota') ||
            lowerInput.includes('joke')
        ) {
            return 'specific_joke'
        }


        if (
            lowerInput.includes('trocadilho') ||
            lowerInput.includes('jogo de palavras')
        ) {
            return 'wordplay'
        }

        if (
            lowerInput.includes('facto') ||
            lowerInput.includes('fato') ||
            lowerInput.includes('curiosidade')
        ) {
            return 'funny_fact'
        }

        return 'general_humor'
    }

    private generateJokePrompt(
        originalInput: string,
        jokeType: string
    ): string {
        const baseContext = `Você está numa conversa com um cliente português interessado em automóveis. 
O cliente pediu para você ser divertido ou contar uma piada. 
Mantenha o humor adequado para um ambiente profissional de vendas de automóveis, 
mas seja descontraído e simpático. Use português de Portugal.`

        switch (jokeType) {
            case 'automotive':
                return `${baseContext}

Conte uma piada ou faça um comentário engraçado relacionado com automóveis, carros, 
condução, ou o mundo automóvel em geral. Pode ser sobre:
- Condutores e os seus hábitos
- Diferenças entre marcas de carros
- Situações típicas de condução
- Mecânicos e oficinas
- Exames de condução

Pedido original: "${originalInput}"`

            case 'specific_joke':
                return `${baseContext}

O cliente pediu especificamente uma piada. Conte uma piada limpa e apropriada, 
preferencialmente relacionada com automóveis, vendas, ou Portugal. 
Se não conseguir relacionar com carros, conte uma piada geral mas sempre adequada.

Pedido original: "${originalInput}"`

            case 'wordplay':
                return `${baseContext}

Faça um trocadilho ou jogo de palavras inteligente, preferencialmente relacionado 
com automóveis, marcas de carros, ou termos do setor automóvel português.

Pedido original: "${originalInput}"`

            case 'funny_fact':
                return `${baseContext}

Partilhe um facto engraçado ou curiosidade interessante sobre automóveis, 
a indústria automóvel, ou condução em Portugal. Apresente de forma divertida.

Pedido original: "${originalInput}"`

            default:
                return `${baseContext}

O cliente quer que você seja divertido ou engraçado. Responda de forma descontraída 
e simpática, mantendo o profissionalismo. Pode contar uma piada, fazer um comentário 
divertido, ou simplesmente responder de forma bem-humorada.

Pedido original: "${originalInput}"`
        }
    }
}
