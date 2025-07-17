import {
    HumanMessage,
    SystemMessage,
    AIMessage,
} from '@langchain/core/messages'
import { WeatherService } from './service/weather.service'
import { ChatOpenAI } from '@langchain/openai'
import dotenv from 'dotenv'

dotenv.config()

// fonte:https://towardsdev.com/tool-calling-with-langchain-node-js-2431996948a7
const model = new ChatOpenAI({
    temperature: 0,
    modelName: 'gpt-4',
    openAIApiKey: process.env.OPENAI_API_KEY,
    maxRetries: 3,
    timeout: 30000,
})

const messages = [
    new SystemMessage(
        `Your name is Miguel Bernardo. You are a helpful chatbot with access to real-time weather data.

INSTRUCTIONS:
- For general questions, respond normally in a friendly manner
- When users ask about weather, temperature, or climate, respond with exactly: "GET_WEATHER:[CITY_NAME]"
- Extract only the city name from weather questions

Examples:
- "What's the weather in Lisboa?" → "GET_WEATHER:Lisboa"
- "Qual é a temperatura atual em São Paulo?" → "GET_WEATHER:São Paulo"  
- "How are you?" → "I'm doing great! How can I help you today?"
- "Climate in Rio de Janeiro" → "GET_WEATHER:Rio de Janeiro"
- "Tempo em Porto" → "GET_WEATHER:Porto"

Make your responses simple and friendly. Be precise with the GET_WEATHER format for weather requests.`
    ),
]

const isWeatherRequest = (response: string): boolean => {
    return response.includes('GET_WEATHER:')
}

const extractCity = (response: string): string => {
    const match = response.match(/GET_WEATHER:(.+)/)
    return match ? match[1].trim() : ''
}
const getWeatherData = async (city: string): Promise<string> => {
    try {
        console.log(`[WEATHER] Getting weather for: ${city}`)

        const coordinates = await WeatherService.getCoordinates(city)

        if (!coordinates.latitude || coordinates.latitude === 0) {
            return `Desculpe, não consegui encontrar a cidade "${city}". Por favor, verifique a ortografia e tente novamente.`
        }

        const forecast = await WeatherService.getForecast(
            coordinates.latitude.toString(),
            coordinates.longitude.toString()
        )

        if (!forecast.temperature) {
            return `Encontrei ${coordinates.name}, ${coordinates.country} mas não consegui obter os dados meteorológicos atuais. Tente novamente mais tarde.`
        }

        return `**Tempo atual em ${coordinates.name}, ${coordinates.country}**

        **Temperatura**: ${forecast.temperature}
        **Velocidade do Vento**: ${forecast.windSpeed}
        **Direção do Vento**: ${forecast.windDirection}
        **Condições**: ${forecast.weatherCode}
        **Coordenadas**: ${coordinates.latitude}°, ${coordinates.longitude}°

        Dados atualizados em tempo real! `
    } catch (error) {
        console.error('Weather error:', error)
        return `Desculpe, encontrei um erro ao obter os dados meteorológicos para "${city}". Por favor, tente novamente mais tarde.`
    }
}

export const sendMessage = async (message: any) => {
    try {
        console.log(`\n [CHAT] User message: "${message}"`)

        messages.push(new HumanMessage(message))

        const response = await model.invoke(messages)
        let finalResponse = response.content as string

        console.log(`[CHAT] Initial response: "${finalResponse}"`)

        if (isWeatherRequest(finalResponse)) {
            const city = extractCity(finalResponse)
            console.log(`[CHAT] Weather request detected for city: "${city}"`)

            if (city) {
                finalResponse = await getWeatherData(city)
                console.log(`[CHAT] Weather data retrieved successfully`)
            } else {
                finalResponse =
                    "I detected you want weather information, but I couldn't identify the city. Please specify which city you'd like weather information for."
            }
        }

        messages.push(new AIMessage(finalResponse))

        console.log(`[CHAT] Final response ready`)

        return finalResponse
    } catch (error) {
        console.error('Chat error:', error)
        return 'Sorry, I encountered an error. Please try again.'
    }
}
