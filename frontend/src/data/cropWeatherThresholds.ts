// Crop Weather Threshold Rules (Frontend Static Data)
export interface CropThreshold {
  crop: string;
  emoji: string;
  thresholds: {
    maxTemp: number;        // °C - Heat stress
    minTemp: number;        // °C - Cold stress
    minRainfall: number;    // mm - Drought risk
    maxRainfall: number;    // mm - Flooding risk
    optimalHumidity: {
      min: number;          // % - Optimal humidity range
      max: number;
    };
  };
}

export const cropWeatherThresholds: CropThreshold[] = [
  {
    crop: "Rice",
    emoji: "🍚",
    thresholds: {
      maxTemp: 37,          // Rice wilts above 37°C
      minTemp: 12,          // Needs warmth for germination
      minRainfall: 120,     // mm/month - Drought risk below this
      maxRainfall: 300,     // mm/month - Flooding risk above this
      optimalHumidity: {
        min: 70,
        max: 95
      }
    }
  },
  {
    crop: "Wheat",
    emoji: "🌾",
    thresholds: {
      maxTemp: 35,          // Heat stress above 35°C
      minTemp: 7,           // Needs vernalization period
      minRainfall: 70,      // mm/month - Drought risk
      maxRainfall: 200,     // mm/month - Excessive rainfall
      optimalHumidity: {
        min: 40,
        max: 75
      }
    }
  },
  {
    crop: "Cotton",
    emoji: "☁️",
    thresholds: {
      maxTemp: 38,          // Heat stress above 38°C
      minTemp: 15,          // Needs warm soil for germination
      minRainfall: 50,      // mm/month - Drought risk
      maxRainfall: 250,     // mm/month - Too much moisture
      optimalHumidity: {
        min: 50,
        max: 80
      }
    }
  },
  {
    crop: "Maize",
    emoji: "🌽",
    thresholds: {
      maxTemp: 35,          // Heat stress
      minTemp: 10,          // Minimum for germination
      minRainfall: 100,     // mm/month
      maxRainfall: 280,     // mm/month
      optimalHumidity: {
        min: 60,
        max: 85
      }
    }
  },
  {
    crop: "Sugarcane",
    emoji: "🍯",
    thresholds: {
      maxTemp: 40,          // Very heat tolerant
      minTemp: 15,          // Tropical crop
      minRainfall: 150,     // mm/month - High water needs
      maxRainfall: 350,     // mm/month
      optimalHumidity: {
        min: 75,
        max: 95
      }
    }
  },
  {
    crop: "Banana",
    emoji: "🍌",
    thresholds: {
      maxTemp: 38,
      minTemp: 15,
      minRainfall: 150,
      maxRainfall: 400,     // Tolerates high rainfall
      optimalHumidity: {
        min: 75,
        max: 95
      }
    }
  }
];

export interface WeatherAlert {
  crop: string;
  emoji: string;
  riskLevel: 'safe' | 'warning' | 'danger';
  alerts: string[];
  timestamp: Date;
}

export interface AlertRule {
  type: string;
  description: string;
  check: (temp: number, rainfall: number, humidity: number, threshold: CropThreshold) => boolean;
  message: (crop: string) => string;
  severity: 'safe' | 'warning' | 'danger';
}

export const alertRules: AlertRule[] = [
  {
    type: 'HIGH_TEMPERATURE',
    description: 'Temperature exceeds safe threshold',
    check: (temp, _, __, threshold) => temp > threshold.thresholds.maxTemp,
    message: (crop) => `🔥 ${crop}: Heat stress alert! Temperature too high for optimal growth.`,
    severity: 'danger'
  },
  {
    type: 'LOW_TEMPERATURE',
    description: 'Temperature below minimum threshold',
    check: (temp, _, __, threshold) => temp < threshold.thresholds.minTemp,
    message: (crop) => `❄️ ${crop}: Cold stress alert! Temperature too low for growth.`,
    severity: 'warning'
  },
  {
    type: 'LOW_RAINFALL',
    description: 'Insufficient rainfall - drought risk',
    check: (_, rainfall, __, threshold) => rainfall < threshold.thresholds.minRainfall,
    message: (crop) => `💧 ${crop}: Drought alert! Rainfall insufficient. Consider irrigation.`,
    severity: 'danger'
  },
  {
    type: 'HIGH_RAINFALL',
    description: 'Excessive rainfall - flooding risk',
    check: (_, rainfall, __, threshold) => rainfall > threshold.thresholds.maxRainfall,
    message: (crop) => `🌊 ${crop}: Flooding alert! Excessive rainfall may cause waterlogging.`,
    severity: 'warning'
  },
  {
    type: 'LOW_HUMIDITY',
    description: 'Humidity below optimal range',
    check: (_, __, humidity, threshold) => humidity < threshold.thresholds.optimalHumidity.min,
    message: (crop) => `💨 ${crop}: Low humidity alert! May increase water stress.`,
    severity: 'warning'
  },
  {
    type: 'HIGH_HUMIDITY',
    description: 'Humidity above optimal range',
    check: (_, __, humidity, threshold) => humidity > threshold.thresholds.optimalHumidity.max,
    message: (crop) => `🌫️ ${crop}: High humidity alert! Risk of fungal diseases.`,
    severity: 'warning'
  }
];
