import React from 'react';
import { Clock, Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import SensorGrid from '@/components/Dashboard/SensorGrid';
import HealthStatus from '@/components/Dashboard/HealthStatus';
import TrendChart from '@/components/Dashboard/TrendChart';
import Chatbot from '@/components/Chatbot/Chatbot';
import { Button } from '@/components/ui/button';
import { useSensorData } from '@/hooks/useSensorData';
import { useLanguage } from '@/contexts/LanguageContext';
import { exportToJSON, exportToCSV, exportWeeklySummary } from '@/lib/exportUtils';

const Index: React.FC = () => {
  const { t } = useLanguage();
  const { currentData, history, getStatus, getOverallHealth } = useSensorData(1000);

  const handleExportJSON = () => {
    if (history.length > 0) {
      exportToJSON(history);
    }
  };

  const handleExportCSV = () => {
    if (history.length > 0) {
      exportToCSV(history);
    }
  };

  const handleExportWeekly = () => {
    if (history.length > 0) {
      exportWeeklySummary(history);
    }
  };

  return (
    <MainLayout>
      <div className="container px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="animate-fade-up">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t('sensorOverview')}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {t('lastUpdated')}: {currentData?.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex flex-wrap gap-2 animate-fade-up" style={{ animationDelay: '100ms' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJSON}
              className="rounded-xl gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <FileJson className="h-4 w-4" />
              {t('downloadJSON')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="rounded-xl gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              {t('downloadCSV')}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleExportWeekly}
              className="rounded-xl gap-2"
            >
              <FileText className="h-4 w-4" />
              {t('weeklySummary')}
            </Button>
          </div>
        </div>

        {/* Health Status */}
        <div className="mb-8">
          <HealthStatus status={getOverallHealth()} />
        </div>

        {/* Sensor Grid */}
        {currentData && (
          <div className="mb-8">
            <SensorGrid data={currentData} getStatus={getStatus} />
          </div>
        )}

        {/* Trend Chart */}
        <TrendChart history={history} />

        {/* Chatbot */}
        <Chatbot />
      </div>
    </MainLayout>
  );
};

export default Index;
