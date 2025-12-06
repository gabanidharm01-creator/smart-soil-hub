import React from 'react';
import { Droplets, Cloud, Thermometer, Leaf, FlaskConical, Zap, Beaker, Activity } from 'lucide-react';
import SensorTile from './SensorTile';
import { SensorData } from '@/hooks/useSensorData';
import { useLanguage } from '@/contexts/LanguageContext';

interface SensorGridProps {
  data: SensorData;
  getStatus: (type: string, value: number) => 'healthy' | 'warning' | 'critical';
}

const SensorGrid: React.FC<SensorGridProps> = ({ data, getStatus }) => {
  const { t } = useLanguage();

  const sensors = [
    {
      key: 'moisture',
      label: t('moisture'),
      value: data.moisture,
      unit: t('percent'),
      icon: <Droplets className="h-6 w-6" />,
      trend: data.trends.moisture,
      colorClass: 'from-blue-500 to-cyan-400',
    },
    {
      key: 'humidity',
      label: t('humidity'),
      value: data.humidity,
      unit: t('percent'),
      icon: <Cloud className="h-6 w-6" />,
      trend: data.trends.humidity,
      colorClass: 'from-sky-500 to-blue-400',
    },
    {
      key: 'temperature',
      label: t('soilTemperature'),
      value: data.temperature,
      unit: t('celsius'),
      icon: <Thermometer className="h-6 w-6" />,
      trend: data.trends.temperature,
      colorClass: 'from-orange-500 to-amber-400',
    },
    {
      key: 'nitrogen',
      label: t('nitrogen'),
      value: data.nitrogen,
      unit: t('mgPerKg'),
      icon: <Leaf className="h-6 w-6" />,
      trend: data.trends.nitrogen,
      colorClass: 'from-green-500 to-emerald-400',
    },
    {
      key: 'phosphorus',
      label: t('phosphorus'),
      value: data.phosphorus,
      unit: t('mgPerKg'),
      icon: <FlaskConical className="h-6 w-6" />,
      trend: data.trends.phosphorus,
      colorClass: 'from-purple-500 to-violet-400',
    },
    {
      key: 'potassium',
      label: t('potassium'),
      value: data.potassium,
      unit: t('mgPerKg'),
      icon: <Zap className="h-6 w-6" />,
      trend: data.trends.potassium,
      colorClass: 'from-amber-500 to-yellow-400',
    },
    {
      key: 'ph',
      label: t('ph'),
      value: data.ph,
      unit: '',
      icon: <Beaker className="h-6 w-6" />,
      trend: data.trends.ph,
      colorClass: 'from-pink-500 to-rose-400',
    },
    {
      key: 'ec',
      label: t('ec'),
      value: data.ec,
      unit: t('mSPerCm'),
      icon: <Activity className="h-6 w-6" />,
      trend: data.trends.ec,
      colorClass: 'from-yellow-500 to-orange-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sensors.map((sensor, index) => (
        <SensorTile
          key={sensor.key}
          label={sensor.label}
          value={sensor.value}
          unit={sensor.unit}
          icon={sensor.icon}
          trend={sensor.trend}
          status={getStatus(sensor.key, sensor.value)}
          colorClass={sensor.colorClass}
          delay={index * 100}
        />
      ))}
    </div>
  );
};

export default SensorGrid;
