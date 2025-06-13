// src/services/weatherService.ts
import { Alert } from "react-native";

const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your actual API key
const BASE_URL = "https://api.openweathermap.org/data/2.5";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  name: string;
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
}

export class WeatherService {
  static async fetchWeatherByCoordinates(
    latitude: number,
    longitude: number,
    unit: "metric" | "imperial" = "metric"
  ): Promise<WeatherData | null> {
    try {
      if (!API_KEY || API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
        Alert.alert(
          "API Key Missing",
          "Please replace 'YOUR_OPENWEATHERMAP_API_KEY' in src/services/weatherService.ts with your actual OpenWeatherMap API key."
        );
        return null;
      }

      const response = await fetch(
        `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${API_KEY}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch weather data");
      }
      const data: WeatherData = await response.json();
      return data;
    } catch (error) {
      console.error("EyeDooApp: Weather service error:", error);
      Alert.alert("Weather Error", (error as Error).message);
      return null;
    }
  }

  static async fetchWeatherByCity(
    cityName: string,
    unit: "metric" | "imperial" = "metric"
  ): Promise<WeatherData | null> {
    try {
      if (!API_KEY || API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
        Alert.alert(
          "API Key Missing",
          "Please replace 'YOUR_OPENWEATHERMAP_API_KEY' in src/services/weatherService.ts with your actual OpenWeatherMap API key."
        );
        return null;
      }

      const response = await fetch(
        `${BASE_URL}/weather?q=${cityName}&units=${unit}&appid=${API_KEY}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch weather data");
      }
      const data: WeatherData = await response.json();
      return data;
    } catch (error) {
      console.error("EyeDooApp: Weather service error:", error);
      Alert.alert("Weather Error", (error as Error).message);
      return null;
    }
  }

  static getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}


