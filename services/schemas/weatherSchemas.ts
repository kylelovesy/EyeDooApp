import { z } from 'zod';
import { CommonSchemas } from '../utils/validationHelpers';

/**
 * EyeDooApp Weather Service Validation Schemas
 * Comprehensive validation for weather operations and API interactions
 */

// Weather condition types
export const WeatherConditionSchema = z.enum([
  'clear',
  'partly_cloudy',
  'cloudy',
  'overcast',
  'light_rain',
  'rain',
  'heavy_rain',
  'drizzle',
  'light_snow',
  'snow',
  'heavy_snow',
  'sleet',
  'hail',
  'thunderstorm',
  'fog',
  'mist',
  'haze',
  'dust',
  'sand',
  'tornado',
  'hurricane'
], {
  errorMap: () => ({ message: 'Invalid weather condition' })
});

// Weather API provider enumeration
export const WeatherProviderSchema = z.enum(['openweathermap', 'weatherapi', 'accuweather'], {
  errorMap: () => ({ message: 'Weather provider must be openweathermap, weatherapi, or accuweather' })
});

// Weather request by coordinates
export const WeatherByCoordinatesInputSchema = z.object({
  latitude: CommonSchemas.latitude,
  longitude: CommonSchemas.longitude,
  units: CommonSchemas.weatherUnit.default('metric'),
  language: z.string()
    .min(2, 'Language code too short')
    .max(5, 'Language code too long')
    .regex(/^[a-z]{2}(_[A-Z]{2})?$/, 'Invalid language code format (use en, en_US)')
    .default('en'),
  includeForecast: z.boolean().default(false),
  forecastDays: z.number()
    .min(1, 'Forecast days must be at least 1')
    .max(14, 'Forecast days cannot exceed 14')
    .default(5)
});

// Weather request by city name
export const WeatherByCityInputSchema = z.object({
  cityName: CommonSchemas.cityName,
  countryCode: z.string()
    .length(2, 'Country code must be 2 characters')
    .regex(/^[A-Z]{2}$/, 'Country code must be uppercase')
    .optional(),
  stateCode: z.string()
    .max(3, 'State code too long')
    .regex(/^[A-Z]{2,3}$/, 'State code must be uppercase')
    .optional(),
  units: CommonSchemas.weatherUnit.default('metric'),
  language: z.string()
    .min(2)
    .max(5)
    .regex(/^[a-z]{2}(_[A-Z]{2})?$/)
    .default('en'),
  includeForecast: z.boolean().default(false),
  forecastDays: z.number().min(1).max(14).default(5)
});

// Current weather data schema
export const CurrentWeatherSchema = z.object({
  location: z.object({
    name: z.string().min(1, 'Location name is required'),
    country: z.string().min(1, 'Country is required'),
    region: z.string().optional(),
    latitude: CommonSchemas.latitude,
    longitude: CommonSchemas.longitude,
    timezone: z.string().min(1, 'Timezone is required'),
    localtime: z.string().min(1, 'Local time is required')
  }),
  current: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    condition: WeatherConditionSchema,
    conditionText: z.string().min(1, 'Condition text is required'),
    humidity: z.number().min(0).max(100),
    pressure: z.number().min(0),
    visibility: z.number().min(0),
    uvIndex: z.number().min(0).max(15),
    windSpeed: z.number().min(0),
    windDirection: z.number().min(0).max(360),
    windDegree: z.string().max(3, 'Wind degree too long').optional(),
    cloudCover: z.number().min(0).max(100),
    lastUpdated: z.string().min(1, 'Last updated time is required'),
    icon: z.string().url('Invalid weather icon URL').optional()
  }),
  units: CommonSchemas.weatherUnit
});

// Weather forecast day schema
export const ForecastDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (use YYYY-MM-DD)'),
  maxTemperature: z.number(),
  minTemperature: z.number(),
  avgTemperature: z.number(),
  condition: WeatherConditionSchema,
  conditionText: z.string().min(1),
  humidity: z.number().min(0).max(100),
  chanceOfRain: z.number().min(0).max(100),
  chanceOfSnow: z.number().min(0).max(100),
  maxWindSpeed: z.number().min(0),
  uvIndex: z.number().min(0).max(15),
  sunrise: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (use HH:MM)'),
  sunset: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (use HH:MM)'),
  moonPhase: z.string().max(50, 'Moon phase description too long').optional(),
  icon: z.string().url('Invalid weather icon URL').optional(),
  hourlyForecast: z.array(z.object({
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
    temperature: z.number(),
    condition: WeatherConditionSchema,
    windSpeed: z.number().min(0),
    humidity: z.number().min(0).max(100),
    chanceOfRain: z.number().min(0).max(100)
  })).max(24, 'Maximum 24 hourly forecasts').optional()
});

// Weather forecast schema
export const WeatherForecastSchema = z.object({
  location: z.object({
    name: z.string().min(1),
    country: z.string().min(1),
    region: z.string().optional(),
    latitude: CommonSchemas.latitude,
    longitude: CommonSchemas.longitude,
    timezone: z.string().min(1)
  }),
  current: CurrentWeatherSchema.shape.current,
  forecast: z.array(ForecastDaySchema)
    .min(1, 'At least one forecast day is required')
    .max(14, 'Maximum 14 forecast days'),
  units: CommonSchemas.weatherUnit,
  lastUpdated: z.string().min(1),
  source: WeatherProviderSchema
});

// Weather alert schema
export const WeatherAlertSchema = z.object({
  id: z.string().min(1, 'Alert ID is required'),
  title: z.string().min(1, 'Alert title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Alert description is required').max(1000, 'Description too long'),
  severity: z.enum(['minor', 'moderate', 'severe', 'extreme']),
  urgency: z.enum(['immediate', 'expected', 'future']),
  areas: z.array(z.string().min(1)).min(1, 'At least one area is required'),
  effectiveFrom: z.date(),
  effectiveUntil: z.date(),
  source: z.string().min(1, 'Alert source is required'),
  event: z.string().min(1, 'Event type is required').max(100, 'Event type too long')
}).refine((data) => {
  return data.effectiveFrom <= data.effectiveUntil;
}, {
  message: "Effective from date must be before or equal to effective until date",
  path: ["effectiveUntil"]
});

// Weather history request schema
export const WeatherHistoryInputSchema = z.object({
  latitude: CommonSchemas.latitude.optional(),
  longitude: CommonSchemas.longitude.optional(),
  cityName: CommonSchemas.cityName.optional(),
  startDate: z.date(),
  endDate: z.date(),
  units: CommonSchemas.weatherUnit.default('metric'),
  includeHourly: z.boolean().default(false)
}).refine((data) => {
  // Either coordinates or city name must be provided
  return (data.latitude !== undefined && data.longitude !== undefined) || data.cityName !== undefined;
}, {
  message: "Either coordinates (latitude and longitude) or city name must be provided"
}).refine((data) => {
  // Start date must be before end date
  return data.startDate <= data.endDate;
}, {
  message: "Start date must be before or equal to end date",
  path: ["endDate"]
}).refine((data) => {
  // Date range cannot exceed 30 days
  const diffTime = Math.abs(data.endDate.getTime() - data.startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30;
}, {
  message: "Date range cannot exceed 30 days",
  path: ["endDate"]
});

// Weather search/autocomplete schema
export const WeatherLocationSearchInputSchema = z.object({
  query: z.string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query too long')
    .trim(),
  limit: z.number()
    .min(1, 'Limit must be at least 1')
    .max(20, 'Limit cannot exceed 20')
    .default(10),
  language: z.string()
    .min(2)
    .max(5)
    .regex(/^[a-z]{2}(_[A-Z]{2})?$/)
    .default('en')
});

// Location search result schema
export const LocationSearchResultSchema = z.object({
  name: z.string().min(1),
  region: z.string().optional(),
  country: z.string().min(1),
  latitude: CommonSchemas.latitude,
  longitude: CommonSchemas.longitude,
  timezone: z.string().optional(),
  population: z.number().min(0).optional(),
  elevation: z.number().optional()
});

// Weather API configuration schema
export const WeatherApiConfigSchema = z.object({
  provider: WeatherProviderSchema,
  apiKey: z.string()
    .min(10, 'API key too short')
    .max(200, 'API key too long')
    .regex(/^[a-zA-Z0-9\-_]+$/, 'API key contains invalid characters'),
  baseUrl: z.string().url('Invalid base URL'),
  rateLimit: z.object({
    requestsPerMinute: z.number().min(1).max(10000),
    requestsPerDay: z.number().min(1).max(1000000)
  }).optional(),
  timeout: z.number()
    .min(1000, 'Timeout must be at least 1 second')
    .max(30000, 'Timeout cannot exceed 30 seconds')
    .default(10000),
  retryAttempts: z.number().min(0).max(5).default(3),
  cacheEnabled: z.boolean().default(true),
  cacheDuration: z.number().min(60).max(3600).default(600) // seconds
});

// Weather data export schema
export const WeatherExportInputSchema = z.object({
  projectId: CommonSchemas.projectId,
  locations: z.array(z.object({
    name: z.string().min(1),
    latitude: CommonSchemas.latitude,
    longitude: CommonSchemas.longitude
  })).min(1, 'At least one location is required').max(10, 'Maximum 10 locations'),
  startDate: z.date(),
  endDate: z.date(),
  format: z.enum(['json', 'csv', 'xml']).default('json'),
  includeHourly: z.boolean().default(false),
  includeAlerts: z.boolean().default(true)
}).refine((data) => {
  return data.startDate <= data.endDate;
}, {
  message: "Start date must be before or equal to end date",
  path: ["endDate"]
});

// Weather notification/alert subscription schema
export const WeatherAlertSubscriptionSchema = z.object({
  userId: CommonSchemas.userId,
  projectId: CommonSchemas.projectId.optional(),
  locations: z.array(z.object({
    name: z.string().min(1),
    latitude: CommonSchemas.latitude,
    longitude: CommonSchemas.longitude,
    radius: z.number().min(1).max(100).default(10) // km
  })).min(1).max(5),
  alertTypes: z.array(z.enum([
    'severe_weather',
    'temperature_extreme',
    'precipitation',
    'wind',
    'visibility',
    'air_quality'
  ])).min(1, 'At least one alert type is required'),
  thresholds: z.object({
    temperature: z.object({
      min: z.number().optional(),
      max: z.number().optional()
    }).optional(),
    windSpeed: z.number().min(0).optional(),
    precipitation: z.number().min(0).optional(),
    visibility: z.number().min(0).optional()
  }).optional(),
  notificationMethods: z.array(z.enum(['email', 'push', 'sms']))
    .min(1, 'At least one notification method is required'),
  isActive: z.boolean().default(true)
});

// Type exports for use in services
export type WeatherByCoordinatesInput = z.infer<typeof WeatherByCoordinatesInputSchema>;
export type WeatherByCityInput = z.infer<typeof WeatherByCityInputSchema>;
export type CurrentWeather = z.infer<typeof CurrentWeatherSchema>;
export type ForecastDay = z.infer<typeof ForecastDaySchema>;
export type WeatherForecast = z.infer<typeof WeatherForecastSchema>;
export type WeatherAlert = z.infer<typeof WeatherAlertSchema>;
export type WeatherHistoryInput = z.infer<typeof WeatherHistoryInputSchema>;
export type WeatherLocationSearchInput = z.infer<typeof WeatherLocationSearchInputSchema>;
export type LocationSearchResult = z.infer<typeof LocationSearchResultSchema>;
export type WeatherApiConfig = z.infer<typeof WeatherApiConfigSchema>;
export type WeatherExportInput = z.infer<typeof WeatherExportInputSchema>;
export type WeatherAlertSubscription = z.infer<typeof WeatherAlertSubscriptionSchema>;
export type WeatherCondition = z.infer<typeof WeatherConditionSchema>;
export type WeatherProvider = z.infer<typeof WeatherProviderSchema>; 