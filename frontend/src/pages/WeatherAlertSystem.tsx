import React, { useState, useEffect } from 'react';
import { AlertCircle, MapPin, Droplets, Wind, Eye, RefreshCw, Bell, CheckCircle } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import Chatbot from '@/components/Chatbot/Chatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import {
  fetchCurrentWeather,
  fetchForecast,
  getUserLocation,
  fetchWeatherByCoords,
  calculateWeatherAlerts,
  sendNotification,
  requestNotificationPermission,
  getRiskLevelLabel,
  calculateForecastStats,
  type OpenWeatherData,
  type ForecastData,
  type WeatherAlert
} from '@/lib/weatherAlertService';
import { cropWeatherThresholds } from '@/data/cropWeatherThresholds';

const WeatherAlertSystem: React.FC = () => {
  const { toast } = useToast();
  
  // State management
  const [city, setCity] = useState<string>('Gujarat');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Rice', 'Wheat', 'Cotton']);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentAlerts, setCurrentAlerts] = useState<WeatherAlert[]>([]);

  /**
   * Fetch weather data for the specified city
   */
  const handleFetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const weather = await fetchCurrentWeather(cityName);
      const forecast = await fetchForecast(cityName);
      
      setWeatherData(weather);
      setForecastData(forecast);
      setLastUpdated(new Date());
      setCity(weather.name);
      
      // Calculate alerts after weather is fetched
      const alerts = calculateWeatherAlerts(weather, selectedCrops);
      setCurrentAlerts(alerts);
      
      toast({
        title: "✅ Weather Data Loaded",
        description: `Weather updated for ${weather.name}`,
        duration: 3000
      });

      // Send notifications if enabled and there are danger alerts
      const dangerAlerts = alerts.filter(a => a.riskLevel === 'danger');
      if (notificationsEnabled && dangerAlerts.length > 0) {
        dangerAlerts.forEach(alert => {
          sendNotification(`${alert.emoji} ${alert.crop} Alert`, {
            body: alert.alerts[0] || 'Check weather conditions',
            tag: alert.crop
          });
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch weather';
      setError(errorMsg);
      toast({
        title: "❌ Error",
        description: errorMsg,
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Use browser geolocation to get weather
   */
  const handleUseCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const location = await getUserLocation();
      const weather = await fetchWeatherByCoords(location.latitude, location.longitude);
      const forecast = await fetchForecast(weather.name);
      
      setWeatherData(weather);
      setForecastData(forecast);
      setLastUpdated(new Date());
      setCity(weather.name);
      
      // Calculate alerts after weather is fetched
      const alerts = calculateWeatherAlerts(weather, selectedCrops);
      setCurrentAlerts(alerts);
      
      toast({
        title: "📍 Location Updated",
        description: `Weather loaded for ${weather.name}`,
        duration: 3000
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMsg);
      toast({
        title: "❌ Location Error",
        description: errorMsg,
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Enable browser notifications
   */
  const handleEnableNotifications = async () => {
    try {
      await requestNotificationPermission();
      setNotificationsEnabled(true);
      toast({
        title: "🔔 Notifications Enabled",
        description: "You will receive alerts for dangerous conditions",
        duration: 3000
      });
    } catch (err) {
      toast({
        title: "❌ Notifications Disabled",
        description: "Please enable notifications in your browser settings",
        duration: 3000
      });
    }
  };

  /**
   * Toggle crop selection and recalculate alerts
   */
  const toggleCrop = (crop: string) => {
    const newCrops = selectedCrops.includes(crop)
      ? selectedCrops.filter(c => c !== crop)
      : [...selectedCrops, crop];
    
    setSelectedCrops(newCrops);
    
    // Recalculate alerts with new crop selection
    if (weatherData) {
      const alerts = calculateWeatherAlerts(weatherData, newCrops);
      setCurrentAlerts(alerts);
    }
  };

  // Initial load
  useEffect(() => {
    handleFetchWeather(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Separate alerts by risk level
  const dangerousAlerts = currentAlerts.filter(a => a.riskLevel === 'danger');
  const warningAlerts = currentAlerts.filter(a => a.riskLevel === 'warning');
  const safeAlerts = currentAlerts.filter(a => a.riskLevel === 'safe');

  return (
    <MainLayout>
      <div className="container px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                🌦️ Weather Alert System
              </h1>
              <p className="text-muted-foreground">
                Real-time weather monitoring for crop protection
              </p>
            </div>
          </div>
        </div>

        {/* Location & Settings */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <Label className="text-sm font-medium">Search Location</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                onKeyPress={(e) => e.key === 'Enter' && handleFetchWeather(city)}
                className="flex-1"
              />
              <Button
                onClick={() => handleFetchWeather(city)}
                disabled={loading}
                className="px-6"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-1" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Location Access</Label>
            <Button
              onClick={handleUseCurrentLocation}
              disabled={loading}
              variant="outline"
              className="w-full mt-2"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Use Current Location
            </Button>
          </div>
        </div>

        {/* Notifications & Last Updated */}
        <div className="flex items-center justify-between mb-8 p-4 rounded-lg bg-muted/50 border border-border/50">
          <div className="text-sm">
            {lastUpdated && (
              <p className="text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button
            onClick={handleEnableNotifications}
            disabled={notificationsEnabled}
            variant={notificationsEnabled ? "default" : "outline"}
            size="sm"
          >
            <Bell className="h-4 w-4 mr-2" />
            {notificationsEnabled ? 'Notifications On' : 'Enable Notifications'}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200 text-red-900">
            <p className="font-semibold">⚠️ Error: {error}</p>
          </div>
        )}

        {/* Current Weather Card */}
        {weatherData && (
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 shadow-lg animate-fade-up">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Main Weather */}
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-6xl">{weatherData.weather[0]?.main === 'Clouds' ? '☁️' : '🌤️'}</div>
                  <div>
                    <h3 className="text-3xl font-bold text-blue-900">{weatherData.main.temp.toFixed(1)}°C</h3>
                    <p className="text-lg text-blue-700 capitalize">{weatherData.weather[0]?.description}</p>
                    <p className="text-sm text-blue-600">Feels like {weatherData.main.feels_like.toFixed(1)}°C</p>
                  </div>
                </div>
              </div>

              {/* Right: Weather Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/50 p-3 backdrop-blur-sm">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Droplets className="h-4 w-4" /> Humidity
                  </p>
                  <p className="text-xl font-bold text-blue-900">{weatherData.main.humidity}%</p>
                </div>
                <div className="rounded-lg bg-white/50 p-3 backdrop-blur-sm">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Wind className="h-4 w-4" /> Wind Speed
                  </p>
                  <p className="text-xl font-bold text-blue-900">{weatherData.wind.speed.toFixed(1)} m/s</p>
                </div>
                <div className="rounded-lg bg-white/50 p-3 backdrop-blur-sm">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Eye className="h-4 w-4" /> Visibility
                  </p>
                  <p className="text-xl font-bold text-blue-900">{weatherData.visibility ? (weatherData.visibility / 1000).toFixed(1) : 'N/A'} km</p>
                </div>
                <div className="rounded-lg bg-white/50 p-3 backdrop-blur-sm">
                  <p className="text-xs text-muted-foreground">Pressure</p>
                  <p className="text-xl font-bold text-blue-900">{weatherData.main.pressure} mb</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Crop Selection */}
        <div className="mb-8 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-6 shadow-soft">
          <h3 className="text-lg font-semibold mb-4">Select Crops to Monitor</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {cropWeatherThresholds.map(crop => (
              <button
                key={crop.crop}
                onClick={() => toggleCrop(crop.crop)}
                className={cn(
                  "p-3 rounded-lg font-medium transition-all text-center",
                  selectedCrops.includes(crop.crop)
                    ? "bg-primary text-white shadow-lg scale-105"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
              >
                <div className="text-2xl mb-1">{crop.emoji}</div>
                <div className="text-xs">{crop.crop}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Alert Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 p-4">
            <p className="text-sm font-semibold text-red-600">🔴 Danger Alerts</p>
            <p className="text-3xl font-bold text-red-900 mt-2">{dangerousAlerts.length}</p>
            <p className="text-xs text-red-700 mt-1">Immediate action recommended</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 p-4">
            <p className="text-sm font-semibold text-yellow-600">🟡 Warnings</p>
            <p className="text-3xl font-bold text-yellow-900 mt-2">{warningAlerts.length}</p>
            <p className="text-xs text-yellow-700 mt-1">Monitor closely</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 p-4">
            <p className="text-sm font-semibold text-green-600">🟢 Safe Conditions</p>
            <p className="text-3xl font-bold text-green-900 mt-2">{safeAlerts.length}</p>
            <p className="text-xs text-green-700 mt-1">Optimal for growth</p>
          </div>
        </div>

        {/* Alerts Display */}
        <div className="space-y-4 mb-8">
          {/* Danger Alerts */}
          {dangerousAlerts.map(alert => (
            <div
              key={`danger-${alert.crop}`}
              className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-400 p-6 shadow-lg animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{alert.emoji}</div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-red-900 mb-2">{alert.crop} - 🔴 Danger</h4>
                  <div className="space-y-1">
                    {alert.alerts.map((msg, idx) => (
                      <p key={idx} className="text-sm text-red-800">{msg}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Warning Alerts */}
          {warningAlerts.map(alert => (
            <div
              key={`warning-${alert.crop}`}
              className="rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-100 border-2 border-yellow-400 p-6 shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{alert.emoji}</div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-yellow-900 mb-2">{alert.crop} - 🟡 Warning</h4>
                  <div className="space-y-1">
                    {alert.alerts.map((msg, idx) => (
                      <p key={idx} className="text-sm text-yellow-800">{msg}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Safe Alerts */}
          {safeAlerts.length > 0 && (
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-400 p-6 shadow-md">
              <h4 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6" /> Safe Conditions
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {safeAlerts.map(alert => (
                  <div key={`safe-${alert.crop}`} className="rounded-lg bg-white/50 p-4 text-center">
                    <p className="text-3xl mb-2">{alert.emoji}</p>
                    <p className="font-semibold text-green-900">{alert.crop}</p>
                    <p className="text-xs text-green-700 mt-1">✅ All parameters optimal</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Forecast Summary */}
        {forecastData && (
          <div className="rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-6 shadow-soft mb-8">
            <h3 className="text-lg font-semibold mb-4">📊 5-Day Forecast Summary</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Average Temperature</p>
                <p className="text-2xl font-bold mt-2">{(() => {
                  const stats = calculateForecastStats(forecastData);
                  return `${stats.avgTemp}°C`;
                })()}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Average Humidity</p>
                <p className="text-2xl font-bold mt-2">{(() => {
                  const stats = calculateForecastStats(forecastData);
                  return `${stats.avgHumidity}%`;
                })()}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Total Rainfall</p>
                <p className="text-2xl font-bold mt-2">{(() => {
                  const stats = calculateForecastStats(forecastData);
                  return `${stats.totalRainfall} mm`;
                })()}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">Data Points</p>
                <p className="text-2xl font-bold mt-2">{forecastData.list.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="rounded-2xl bg-blue-50 border border-blue-200 p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-blue-900">ℹ️ How This Works</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✅ <strong>Real-time Data:</strong> Fetches current weather from OpenWeatherMap API</li>
            <li>✅ <strong>Crop-Specific Thresholds:</strong> Each crop has defined safe temperature, rainfall, and humidity ranges</li>
            <li>✅ <strong>Instant Alerts:</strong> Compares live weather against thresholds and displays warnings</li>
            <li>✅ <strong>Browser Notifications:</strong> Optional push notifications for dangerous conditions</li>
            <li>✅ <strong>Forecast Analysis:</strong> Shows 5-day forecast trends to plan ahead</li>
            <li>✅ <strong>Geolocation Support:</strong> Use browser location or search any city</li>
          </ul>
        </div>

        <Chatbot />
      </div>
    </MainLayout>
  );
};

export default WeatherAlertSystem;
