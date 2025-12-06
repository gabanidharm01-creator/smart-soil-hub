import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface HealthStatusProps {
  status: 'healthy' | 'warning' | 'critical';
}

const HealthStatus: React.FC<HealthStatusProps> = ({ status }) => {
  const { t } = useLanguage();

  const statusConfig = {
    healthy: {
      icon: CheckCircle2,
      label: t('healthy'),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      gradient: 'from-primary/20 to-primary/5',
      message: 'All sensor readings are within optimal ranges. Your soil is in excellent condition!',
    },
    warning: {
      icon: AlertTriangle,
      label: t('warning'),
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      gradient: 'from-amber-500/20 to-amber-500/5',
      message: 'Some readings are outside optimal ranges. Consider checking nutrient levels.',
    },
    critical: {
      icon: AlertCircle,
      label: t('critical'),
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/30',
      gradient: 'from-destructive/20 to-destructive/5',
      message: 'Critical readings detected! Immediate attention required for soil health.',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 border",
        "bg-card/80 backdrop-blur-xl",
        config.borderColor,
        "animate-fade-up"
      )}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50",
          config.gradient
        )}
      />

      <div className="relative flex items-start gap-4">
        {/* Animated icon */}
        <div className={cn(
          "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl",
          config.bgColor
        )}>
          <Icon className={cn("h-7 w-7", config.color)} />
          {status === 'healthy' && (
            <div className="absolute inset-0 rounded-xl animate-pulse-ring bg-primary/30" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Heart className={cn("h-4 w-4", config.color)} />
            <h3 className="text-lg font-semibold">{t('soilHealth')}</h3>
          </div>

          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3",
            config.bgColor,
            config.color
          )}>
            <span className="relative flex h-2 w-2">
              <span className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                status === 'healthy' ? 'bg-primary' : status === 'warning' ? 'bg-amber-500' : 'bg-destructive'
              )} />
              <span className={cn(
                "relative inline-flex rounded-full h-2 w-2",
                status === 'healthy' ? 'bg-primary' : status === 'warning' ? 'bg-amber-500' : 'bg-destructive'
              )} />
            </span>
            {config.label}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {config.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthStatus;
