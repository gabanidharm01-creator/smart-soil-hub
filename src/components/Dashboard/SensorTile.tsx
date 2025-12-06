import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { SensorTrend } from '@/hooks/useSensorData';
import { cn } from '@/lib/utils';

interface SensorTileProps {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  trend: SensorTrend;
  status: 'healthy' | 'warning' | 'critical';
  colorClass: string;
  delay?: number;
}

const SensorTile: React.FC<SensorTileProps> = ({
  label,
  value,
  unit,
  icon,
  trend,
  status,
  colorClass,
  delay = 0,
}) => {
  const TrendIcon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus;
  
  const StatusIcon = status === 'healthy' ? CheckCircle : status === 'warning' ? AlertTriangle : AlertCircle;

  const statusColors = {
    healthy: 'text-primary bg-primary/10',
    warning: 'text-amber-500 bg-amber-500/10',
    critical: 'text-destructive bg-destructive/10',
  };

  const trendColors = {
    up: 'text-emerald-500',
    down: 'text-rose-500',
    stable: 'text-muted-foreground',
  };

  return (
    <div
      className={cn(
        "sensor-tile group relative p-5 rounded-2xl",
        "bg-card/80 backdrop-blur-xl border border-border/50",
        "shadow-soft hover:shadow-card",
        "animate-fade-up opacity-0"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          colorClass
        )}
        style={{ opacity: 0.05 }}
      />

      {/* Status indicator */}
      <div className={cn(
        "absolute top-3 right-3 p-1.5 rounded-lg transition-transform duration-300 group-hover:scale-110",
        statusColors[status]
      )}>
        <StatusIcon className="h-4 w-4" />
      </div>

      {/* Icon */}
      <div className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl mb-4",
        "bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110",
        colorClass
      )}>
        <div className="text-white">{icon}</div>
      </div>

      {/* Label */}
      <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tight tabular-nums">
          {value}
        </span>
        <span className="text-sm text-muted-foreground font-medium">{unit}</span>
      </div>

      {/* Trend */}
      <div className={cn(
        "flex items-center gap-1 mt-3 text-sm font-medium",
        trendColors[trend.direction]
      )}>
        <TrendIcon className="h-4 w-4" />
        <span>
          {trend.direction === 'stable' 
            ? 'Stable' 
            : `${trend.percentage.toFixed(1)}%`}
        </span>
      </div>

      {/* Pulse effect on data update */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/0 group-hover:ring-primary/20 transition-all duration-300" />
    </div>
  );
};

export default SensorTile;
