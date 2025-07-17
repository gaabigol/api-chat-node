import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export class WeatherService {
    public static async getCoordinates(city: string): Promise<{
        latitude: number | 0
        longitude: number | 0
        name: string | ''
        country: string | ''
    }> {
        const response = await axios.get(
            `${process.env.GEOCODING_API}/search?name=${encodeURIComponent(
                city
            )}&count=1`
        )

        if (response.data.results?.length > 0) {
            const { latitude, longitude, name, country } =
                response.data.results[0]
            return {
                latitude: latitude,
                longitude: longitude,
                name: name,
                country: country,
            }
        }

        return {
            latitude: 0,
            longitude: 0,
            name: '',
            country: '',
        }
    }

    public static async getForecast(latitude: string, longitude: string) {
        const response = await axios.get(
            `${process.env.OPEN_METEO_API}/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        )

        if (response.data.latitude) {
            return {
                latitude: latitude,
                longitude: longitude,
                temperature:
                    response.data.current_weather.temperature +
                    ' ' +
                    response.data.current_weather_units.temperature,
                windSpeed:
                    response.data.current_weather.windspeed +
                    ' ' +
                    response.data.current_weather_units.windspeed,
                windDirection:
                    response.data.current_weather.winddirection +
                    response.data.current_weather_units.winddirection,
                weatherCode:
                    response.data.current_weather.weathercode +
                    ' ' +
                    response.data.current_weather_units.weathercode,
            }
        }

        return {
            latitude: '',
            longitude: '',
            temperature: '',
            windSpeed: '',
            windDirection: '',
            weatherCode: '',
        }
    }
}
