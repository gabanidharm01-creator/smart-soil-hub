import { useState, useEffect, useCallback, useRef } from 'react';

export interface SensorReading {
  moisture: number;
  humidity: number;
  temperature: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  ec: number;
  timestamp: Date;
}

export interface SensorTrend {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
}

export interface SensorData extends SensorReading {
  trends: {
    moisture: SensorTrend;
    humidity: SensorTrend;
    temperature: SensorTrend;
    nitrogen: SensorTrend;
    phosphorus: SensorTrend;
    potassium: SensorTrend;
    ph: SensorTrend;
    ec: SensorTrend;
  };
}

const generateRandomValue = (min: number, max: number, decimals: number = 1): number => {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
};

const generateVariation = (current: number, min: number, max: number, maxChange: number): number => {
  const change = (Math.random() - 0.5) * maxChange * 2;
  const newValue = current + change;
  return Math.max(min, Math.min(max, Number(newValue.toFixed(1))));
};

const calculateTrend = (current: number, previous: number): SensorTrend => {
  const diff = current - previous;
  const percentage = previous !== 0 ? Math.abs((diff / previous) * 100) : 0;
  
  if (Math.abs(diff) < 0.5) {
    return { direction: 'stable', percentage: 0 };
  }
  
  return {
    direction: diff > 0 ? 'up' : 'down',
    percentage: Number(percentage.toFixed(1)),
  };
};

export const useSensorData = (updateInterval: number = 1000) => {
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<SensorReading[]>([]);
  const previousDataRef = useRef<SensorReading | null>(null);

  const generateInitialData = useCallback((): SensorReading => {
    return {
      moisture: generateRandomValue(35, 65, 1),
      humidity: generateRandomValue(40, 80, 1),
      temperature: generateRandomValue(18, 32, 1),
      nitrogen: generateRandomValue(20, 80, 0),
      phosphorus: generateRandomValue(15, 60, 0),
      potassium: generateRandomValue(100, 300, 0),
      ph: generateRandomValue(5.5, 8.0, 1),
      ec: generateRandomValue(0.5, 2.5, 2),
      timestamp: new Date(),
    };
  }, []);

  const updateSensorData = useCallback(() => {
    setCurrentData((prev) => {
      const previousReading = prev || generateInitialData();
      
      const newReading: SensorReading = {
        moisture: generateVariation(previousReading.moisture, 20, 90, 2),
        humidity: generateVariation(previousReading.humidity, 30, 95, 3),
        temperature: generateVariation(previousReading.temperature, 15, 40, 0.5),
        nitrogen: generateVariation(previousReading.nitrogen, 10, 100, 5),
        phosphorus: generateVariation(previousReading.phosphorus, 5, 80, 3),
        potassium: generateVariation(previousReading.potassium, 50, 400, 10),
        ph: generateVariation(previousReading.ph, 4.5, 9.0, 0.1),
        ec: generateVariation(previousReading.ec, 0.2, 4.0, 0.1),
        timestamp: new Date(),
      };

      const trends = {
        moisture: calculateTrend(newReading.moisture, previousReading.moisture),
        humidity: calculateTrend(newReading.humidity, previousReading.humidity),
        temperature: calculateTrend(newReading.temperature, previousReading.temperature),
        nitrogen: calculateTrend(newReading.nitrogen, previousReading.nitrogen),
        phosphorus: calculateTrend(newReading.phosphorus, previousReading.phosphorus),
        potassium: calculateTrend(newReading.potassium, previousReading.potassium),
        ph: calculateTrend(newReading.ph, previousReading.ph),
        ec: calculateTrend(newReading.ec, previousReading.ec),
      };

      previousDataRef.current = newReading;

      return { ...newReading, trends };
    });

    setHistory((prev) => {
      const newHistory = [...prev, previousDataRef.current!].filter(Boolean);
      // Keep last 100 readings for history
      return newHistory.slice(-100);
    });
  }, [generateInitialData]);

  useEffect(() => {
    // Generate initial data
    updateSensorData();

    // Set up interval for updates
    const interval = setInterval(updateSensorData, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval, updateSensorData]);

  const getStatus = useCallback((type: keyof SensorReading, value: number): 'healthy' | 'warning' | 'critical' => {
    const ranges = {
      moisture: { low: 30, high: 70, criticalLow: 20, criticalHigh: 85 },
      humidity: { low: 40, high: 80, criticalLow: 25, criticalHigh: 95 },
      temperature: { low: 18, high: 30, criticalLow: 10, criticalHigh: 40 },
      nitrogen: { low: 25, high: 75, criticalLow: 15, criticalHigh: 90 },
      phosphorus: { low: 20, high: 50, criticalLow: 10, criticalHigh: 70 },
      potassium: { low: 120, high: 280, criticalLow: 80, criticalHigh: 350 },
      ph: { low: 6.0, high: 7.5, criticalLow: 5.0, criticalHigh: 8.5 },
      ec: { low: 0.8, high: 2.0, criticalLow: 0.3, criticalHigh: 3.5 },
    };

    const range = ranges[type as keyof typeof ranges];
    if (!range) return 'healthy';

    if (value < range.criticalLow || value > range.criticalHigh) {
      return 'critical';
    }
    if (value < range.low || value > range.high) {
      return 'warning';
    }
    return 'healthy';
  }, []);

  const getOverallHealth = useCallback((): 'healthy' | 'warning' | 'critical' => {
    if (!currentData) return 'healthy';

    const statuses = [
      getStatus('moisture', currentData.moisture),
      getStatus('humidity', currentData.humidity),
      getStatus('temperature', currentData.temperature),
      getStatus('nitrogen', currentData.nitrogen),
      getStatus('phosphorus', currentData.phosphorus),
      getStatus('potassium', currentData.potassium),
      getStatus('ph', currentData.ph),
      getStatus('ec', currentData.ec),
    ];

    if (statuses.includes('critical')) return 'critical';
    if (statuses.includes('warning')) return 'warning';
    return 'healthy';
  }, [currentData, getStatus]);

  return {
    currentData,
    history,
    getStatus,
    getOverallHealth,
  };
};
