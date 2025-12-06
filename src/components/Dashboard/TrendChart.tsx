import React, { useState } from 'react';
import { ChartLine } from 'lucide-react';
import { SensorReading } from '@/hooks/useSensorData';
import { useLanguage } from '@/contexts/LanguageContext';
import SensorChart from './SensorChart';
import { cn } from '@/lib/utils';

interface TrendChartProps {
  history: SensorReading[];
}

const TrendChart: React.FC<TrendChartProps> = ({ history }) => {
  const { t } = useLanguage();
  const [selectedSensor, setSelectedSensor] = useState<keyof Omit<SensorReading, 'timestamp'>>('moisture');

  const sensorOptions: { key: keyof Omit<SensorReading, 'timestamp'>; label: string; color: string }[] = [
    { key: 'moisture', label: t('moisture'), color: 'bg-blue-500' },
    { key: 'humidity', label: t('humidity'), color: 'bg-cyan-500' },
    { key: 'temperature', label: t('soilTemperature'), color: 'bg-orange-500' },
    { key: 'nitrogen', label: t('nitrogen'), color: 'bg-green-500' },
    { key: 'phosphorus', label: t('phosphorus'), color: 'bg-purple-500' },
    { key: 'potassium', label: t('potassium'), color: 'bg-yellow-500' },
    { key: 'ph', label: t('ph'), color: 'bg-pink-500' },
    { key: 'ec', label: t('ec'), color: 'bg-amber-500' },
  ];

  return (
    <div className="rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-6 shadow-soft animate-fade-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <ChartLine className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{t('trendAnalysis')}</h3>
          <p className="text-sm text-muted-foreground">{t('last24Hours')}</p>
        </div>
      </div>

      {/* Sensor selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sensorOptions.map((sensor) => (
          <button
            key={sensor.key}
            onClick={() => setSelectedSensor(sensor.key)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
              selectedSensor === sensor.key
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", sensor.color)} />
            {sensor.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      {history.length > 0 ? (
        <SensorChart history={history} selectedSensor={selectedSensor} />
      ) : (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          {t('loading')}
        </div>
      )}
    </div>
  );
};

export default TrendChart;
