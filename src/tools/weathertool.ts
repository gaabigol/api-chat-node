import { WeatherService } from '../service/weather.service'
import { ToolResponse } from '../types/chat.types'
import { BaseTool } from './base/baseTools'

export class WeatherTool extends BaseTool {
    name = 'weather'
    description = 'Get current weather information for any city'
    pattern =
        /(?:weather|tempo|temperatura|climate|clima).*?(?:in|em|de|para)\s+([^?.!]+)/i

    async execute(
        input: string,
        match: RegExpMatchArray
    ): Promise<ToolResponse> {
        try {
            const city = match[1].trim()
            console.log(`🌤️ [WEATHER TOOL] Getting weather for: ${city}`)

            const coordinates = await WeatherService.getCoordinates(city)

            if (!coordinates.latitude || coordinates.latitude === 0) {
                return this.createErrorResponse(
                    `Sorry, I couldn't find the city "${city}". Please check the spelling and try again.`
                )
            }

            const forecast = await WeatherService.getForecast(
                coordinates.latitude.toString(),
                coordinates.longitude.toString()
            )

            if (!forecast.temperature) {
                return this.createErrorResponse(
                    `I found ${coordinates.name}, ${coordinates.country} but couldn't get current weather data. Please try again later.`
                )
            }

            const weatherData = `Temperatura Atual em ${coordinates.name}, ${coordinates.country},
            Temperatura:${forecast.temperature}°C
            Velocidade do vento: ${forecast.windSpeed} km/h
            direção do vento: ${forecast.windDirection}°
            Código meteorológico: ${forecast.weatherCode}
            localização: ${coordinates.latitude}°, ${coordinates.longitude}°`

            return this.createSuccessResponse(weatherData)
        } catch (error) {
            console.error('🔥 Weather Tool Error:', error)
            return this.createErrorResponse(
                `Sorry, I encountered an error getting weather data for "${match[1]}". Please try again later.`
            )
        }
    }
}
