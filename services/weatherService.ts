// src/services/weatherService.ts
import { Alert } from "react-native";
import { z } from 'zod';
import {
  CommonSchemas,
  createServiceError,
  OPERATION_NAMES,
  SERVICE_NAMES,
  validateAndParse,
  validateServiceParams,
  WeatherByCityInputSchema,
  WeatherByCoordinatesInputSchema
} from './schemas';

// Configuration - should be moved to environment variables in production
const DEFAULT_CONFIG = {
  apiKey: "YOUR_OPENWEATHERMAP_API_KEY", // Replace with your actual API key
  baseUrl: "https://api.openweathermap.org/data/2.5",
  timeout: 10000,
  retryAttempts: 2
};

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
  private static config = DEFAULT_CONFIG;

  /**
   * Updates the weather service configuration.
   * @param newConfig Partial configuration to update.
   */
  static updateConfig(newConfig: Partial<typeof DEFAULT_CONFIG>): void {
    try {
      // Validate the configuration if provided
      if (newConfig.apiKey) {
        validateAndParse(
          CommonSchemas.weatherUnit.or(z.string().min(10, 'API key too short')),
          newConfig.apiKey,
          'updateConfig apiKey'
        );
      }

      this.config = { ...this.config, ...newConfig };
      console.log('EyeDooApp: Weather service configuration updated');
    } catch (error) {
      throw createServiceError(
        SERVICE_NAMES.WEATHER,
        'updateConfig',
        error,
        'Failed to update weather service configuration'
      );
    }
  }

  /**
   * Validates API configuration before making requests.
   */
  private static validateApiConfiguration(): void {
    if (!this.config.apiKey || this.config.apiKey === "YOUR_OPENWEATHERMAP_API_KEY") {
      throw createServiceError(
        SERVICE_NAMES.WEATHER,
        'validateApiConfiguration',
        new Error('API key not configured'),
        'Please configure a valid OpenWeatherMap API key'
      );
    }
  }

  /**
   * Makes a validated HTTP request to the weather API.
   */
  private static async makeWeatherRequest(url: string): Promise<WeatherData> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'EyeDooApp-WeatherService/1.0'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: WeatherData = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw createServiceError(
          SERVICE_NAMES.WEATHER,
          'makeWeatherRequest',
          error,
          'Request timeout - please try again'
        );
      }
      
      throw error;
    }
  }

  /**
   * Fetches weather data by coordinates with full validation.
   * @param latitude Latitude coordinate.
   * @param longitude Longitude coordinate.
   * @param unit Temperature unit (metric or imperial).
   * @param language Language for weather descriptions.
   * @returns Weather data or null if failed.
   */
  static async fetchWeatherByCoordinates(
    latitude: number,
    longitude: number,
    unit: "metric" | "imperial" = "metric",
    language: string = "en"
  ): Promise<WeatherData | null> {
    try {
      // Validate inputs using schema
      const validatedInput = validateAndParse(
        WeatherByCoordinatesInputSchema,
        { latitude, longitude, units: unit, language },
        'fetchWeatherByCoordinates input'
      );

      // Validate API configuration
      this.validateApiConfiguration();

      const url = `${this.config.baseUrl}/weather?lat=${validatedInput.latitude}&lon=${validatedInput.longitude}&units=${validatedInput.units}&lang=${validatedInput.language}&appid=${this.config.apiKey}`;
      
      const data = await this.makeWeatherRequest(url);
      
      console.log('EyeDooApp: Weather data fetched successfully by coordinates');
      return data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        // For configuration errors, show user-friendly alert
        if (error.message.includes('API key not configured')) {
          Alert.alert(
            "API Key Missing",
            "Please configure your OpenWeatherMap API key in the weather service."
          );
        } else {
          Alert.alert("Weather Error", error.message);
        }
        return null;
      }

      const serviceError = createServiceError(
        SERVICE_NAMES.WEATHER,
        OPERATION_NAMES.GET_WEATHER,
        error,
        'Failed to fetch weather data by coordinates'
      );
      
      Alert.alert("Weather Error", serviceError.message);
      return null;
    }
  }

  /**
   * Fetches weather data by city name with full validation.
   * @param cityName Name of the city.
   * @param countryCode Optional country code.
   * @param unit Temperature unit (metric or imperial).
   * @param language Language for weather descriptions.
   * @returns Weather data or null if failed.
   */
  static async fetchWeatherByCity(
    cityName: string,
    countryCode?: string,
    unit: "metric" | "imperial" = "metric",
    language: string = "en"
  ): Promise<WeatherData | null> {
    try {
      // Validate inputs using schema
      const validatedInput = validateAndParse(
        WeatherByCityInputSchema,
        { cityName, countryCode, units: unit, language },
        'fetchWeatherByCity input'
      );

      // Validate API configuration
      this.validateApiConfiguration();

      // Build query string
      let query = validatedInput.cityName;
      if (validatedInput.countryCode) {
        query += `,${validatedInput.countryCode}`;
      }

      const url = `${this.config.baseUrl}/weather?q=${encodeURIComponent(query)}&units=${validatedInput.units}&lang=${validatedInput.language}&appid=${this.config.apiKey}`;
      
      const data = await this.makeWeatherRequest(url);
      
      console.log('EyeDooApp: Weather data fetched successfully by city name');
      return data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        // For configuration errors, show user-friendly alert
        if (error.message.includes('API key not configured')) {
          Alert.alert(
            "API Key Missing",
            "Please configure your OpenWeatherMap API key in the weather service."
          );
        } else {
          Alert.alert("Weather Error", error.message);
        }
        return null;
      }

      const serviceError = createServiceError(
        SERVICE_NAMES.WEATHER,
        OPERATION_NAMES.GET_WEATHER,
        error,
        'Failed to fetch weather data by city name'
      );
      
      Alert.alert("Weather Error", serviceError.message);
      return null;
    }
  }

  /**
   * Searches for cities/locations with validation.
   * @param query Search query for city names.
   * @param limit Maximum number of results.
   * @returns Array of location suggestions or empty array if failed.
   */
  static async searchLocations(query: string, limit: number = 5): Promise<any[]> {
    try {
      // Validate inputs
      validateServiceParams(
        { query, limit },
        ['query'],
        SERVICE_NAMES.WEATHER,
        OPERATION_NAMES.SEARCH_LOCATIONS
      );

      const validatedQuery = validateAndParse(
        CommonSchemas.cityName,
        query,
        'searchLocations query'
      );

      if (limit < 1 || limit > 20) {
        throw createServiceError(
          SERVICE_NAMES.WEATHER,
          OPERATION_NAMES.SEARCH_LOCATIONS,
          new Error('Limit must be between 1 and 20')
        );
      }

      // Validate API configuration
      this.validateApiConfiguration();

      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(validatedQuery)}&limit=${limit}&appid=${this.config.apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const locations = await response.json();
      console.log(`EyeDooApp: Found ${locations.length} location(s) for query: ${validatedQuery}`);
      return locations;
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        console.error(error.message);
        return [];
      }

      createServiceError(
        SERVICE_NAMES.WEATHER,
        OPERATION_NAMES.SEARCH_LOCATIONS,
        error,
        'Failed to search locations'
      );
      return [];
    }
  }

  /**
   * Gets weather icon URL with validation.
   * @param iconCode Weather icon code from API.
   * @returns Full URL to weather icon.
   */
  static getWeatherIconUrl(iconCode: string): string {
    try {
      // Validate icon code format
      if (!iconCode || typeof iconCode !== 'string' || iconCode.length < 2) {
        throw createServiceError(
          SERVICE_NAMES.WEATHER,
          'getWeatherIconUrl',
          new Error('Invalid icon code format')
        );
      }

      // Basic validation for icon code pattern (should be like "01d", "02n", etc.)
      if (!/^[0-9]{2}[dn]$/.test(iconCode)) {
        throw createServiceError(
          SERVICE_NAMES.WEATHER,
          'getWeatherIconUrl',
          new Error('Icon code must match pattern: [0-9]{2}[dn]')
        );
      }

      return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    } catch (error) {
      if (error instanceof Error && error.message.includes('EyeDooApp:')) {
        console.error(error.message);
        // Return a default icon or empty string
        return '';
      }
      
      createServiceError(
        SERVICE_NAMES.WEATHER,
        'getWeatherIconUrl',
        error,
        'Failed to generate weather icon URL'
      );
      return '';
    }
  }

  /**
   * Gets the current service configuration.
   * @returns Current configuration object.
   */
  static getConfig(): typeof DEFAULT_CONFIG {
    return { ...this.config };
  }

  /**
   * Tests the API connection and configuration.
   * @returns Promise resolving to true if connection is successful.
   */
  static async testConnection(): Promise<boolean> {
    try {
      this.validateApiConfiguration();
      
      // Test with a simple coordinates request (London)
      const testData = await this.fetchWeatherByCoordinates(51.5074, -0.1278);
      
      if (testData) {
        console.log('EyeDooApp: Weather API connection test successful');
        return true;
      }
      
      return false;
    } catch (error) {
      createServiceError(
        SERVICE_NAMES.WEATHER,
        'testConnection',
        error,
        'Weather API connection test failed'
      );
      return false;
    }
  }
}


