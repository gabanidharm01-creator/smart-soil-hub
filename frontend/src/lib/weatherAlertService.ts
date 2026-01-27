import { CropThreshold, WeatherAlert, alertRules, cropWeatherThresholds } from '@/data/cropWeatherThresholds';

export type { WeatherAlert };

export interface OpenWeatherData {
  coord: { lon: number; lat: number };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{ main: string; description: string; icon: string }>;
  wind: { speed: number };
  clouds: { all: number };
  visibility?: number;
  rain?: { '1h'?: number };
  name: string;
  sys: { country: string };
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{ main: string }>;
    rain?: { '3h'?: number };
  }>;
  city: { name: string; country: string };
}

const OPENWEATHER_API_KEY = '6cc932b3a21d1d754cf48ef872d5727a';
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

/**
 * Fetch current weather for a given city
 */
export async function fetchCurrentWeather(city: string): Promise<OpenWeatherData> {
  try {
    const response = await fetch(
      `${CURRENT_WEATHER_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
}

/**
 * Fetch 5-day forecast for a given city
 */
export async function fetchForecast(city: string): Promise<ForecastData> {
  try {
    const response = await fetch(
      `${FORECAST_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
}

/**
 * Get user's location using browser Geolocation API
 */
export function getUserLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.warn('Geolocation error:', error);
        reject(error);
      }
    );
  });
}

/**
 * Fetch weather by coordinates (used after geolocation)
 */
export async function fetchWeatherByCoords(lat: number, lon: number): Promise<OpenWeatherData> {
  try {
    const response = await fetch(
      `${CURRENT_WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather by coords:', error);
    throw error;
  }
}

/**
 * Calculate weather alerts for all supported crops
 */
export function calculateWeatherAlerts(
  weatherData: OpenWeatherData,
  selectedCrops?: string[]
): WeatherAlert[] {
  const temp = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const rainfall = weatherData.rain?.['1h'] || 0; // Current rainfall in mm

  const crops = selectedCrops 
    ? cropWeatherThresholds.filter(c => selectedCrops.includes(c.crop))
    : cropWeatherThresholds;

  return crops.map(crop => {
    const alerts: string[] = [];
    let maxSeverity: 'safe' | 'warning' | 'danger' = 'safe';

    // Check all alert rules
    alertRules.forEach(rule => {
      if (rule.check(temp, rainfall, humidity, crop)) {
        alerts.push(rule.message(crop.crop));
        
        // Update max severity (danger > warning > safe)
        if (rule.severity === 'danger') {
          maxSeverity = 'danger';
        } else if (rule.severity === 'warning' && maxSeverity !== 'danger') {
          maxSeverity = 'warning';
        }
      }
    });

    return {
      crop: crop.crop,
      emoji: crop.emoji,
      riskLevel: maxSeverity,
      alerts,
      timestamp: new Date()
    };
  });
}

/**
 * Send browser notification for alerts
 */
export function sendNotification(title: string, options?: NotificationOptions) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '🚨',
      ...options
    });
  }
}

/**
 * Request notification permission
 */
export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return Promise.reject(new Error('Notifications not supported'));
  }
  
  if (Notification.permission === 'granted') {
    return Promise.resolve('granted');
  }
  
  if (Notification.permission !== 'denied') {
    return Notification.requestPermission();
  }
  
  return Promise.reject(new Error('Notification permission denied'));
}

/**
 * Format alert message for display
 */
export function formatAlertMessage(alert: WeatherAlert): string {
  if (alert.alerts.length === 0) {
    return `✅ ${alert.crop}: All weather parameters optimal for growth!`;
  }
  return alert.alerts.join('\n');
}

/**
 * Get risk level color for UI
 */
export function getRiskLevelColor(level: 'safe' | 'warning' | 'danger'): string {
  switch (level) {
    case 'safe':
      return '#22c55e'; // green
    case 'warning':
      return '#eab308'; // yellow
    case 'danger':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
}

/**
 * Get risk level label
 */
export function getRiskLevelLabel(level: 'safe' | 'warning' | 'danger'): string {
  switch (level) {
    case 'safe':
      return '🟢 Safe';
    case 'warning':
      return '🟡 Warning';
    case 'danger':
      return '🔴 Danger';
    default:
      return '⚪ Unknown';
  }
}

/**
 * Calculate average weather from forecast
 */
export function calculateForecastStats(forecastData: ForecastData) {
  const avgTemp = forecastData.list.reduce((sum, item) => sum + item.main.temp, 0) / forecastData.list.length;
  const avgHumidity = forecastData.list.reduce((sum, item) => sum + item.main.humidity, 0) / forecastData.list.length;
  const totalRainfall = forecastData.list.reduce((sum, item) => sum + (item.rain?.['3h'] || 0), 0);
  
  return {
    avgTemp: Math.round(avgTemp * 10) / 10,
    avgHumidity: Math.round(avgHumidity),
    totalRainfall: Math.round(totalRainfall * 10) / 10
  };
}
