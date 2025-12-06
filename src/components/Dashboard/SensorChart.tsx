import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { SensorReading } from '@/hooks/useSensorData';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface SensorChartProps {
  history: SensorReading[];
  selectedSensor: keyof Omit<SensorReading, 'timestamp'>;
}

const SensorChart: React.FC<SensorChartProps> = ({ history, selectedSensor }) => {
  const { t } = useLanguage();

  const chartData = useMemo(() => {
    return history.slice(-20).map((reading, index) => ({
      time: new Date(reading.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }),
      value: reading[selectedSensor] as number,
      index,
    }));
  }, [history, selectedSensor]);

  const sensorColors: Record<string, string> = {
    moisture: '#3b82f6',
    humidity: '#06b6d4',
    temperature: '#f97316',
    nitrogen: '#22c55e',
    phosphorus: '#a855f7',
    potassium: '#eab308',
    ph: '#ec4899',
    ec: '#f59e0b',
  };

  const color = sensorColors[selectedSensor] || '#22c55e';

  const sensorLabels: Record<string, string> = {
    moisture: t('moisture'),
    humidity: t('humidity'),
    temperature: t('soilTemperature'),
    nitrogen: t('nitrogen'),
    phosphorus: t('phosphorus'),
    potassium: t('potassium'),
    ph: t('ph'),
    ec: t('ec'),
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${selectedSensor}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            vertical={false}
          />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-card)',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value: number) => [
              `${value}`,
              sensorLabels[selectedSensor]
            ]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${selectedSensor})`}
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorChart;
