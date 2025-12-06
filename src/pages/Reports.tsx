import React from 'react';
import { FileText, FileJson, FileSpreadsheet, Download, Calendar, BarChart3, TrendingUp } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import Chatbot from '@/components/Chatbot/Chatbot';
import { Button } from '@/components/ui/button';
import { useSensorData } from '@/hooks/useSensorData';
import { useLanguage } from '@/contexts/LanguageContext';
import { exportToJSON, exportToCSV, exportWeeklySummary } from '@/lib/exportUtils';
import { cn } from '@/lib/utils';

const Reports: React.FC = () => {
  const { t } = useLanguage();
  const { history } = useSensorData(1000);

  const reportTypes = [
    {
      title: t('downloadJSON'),
      description: 'Export all sensor readings in JSON format for data analysis and integration',
      icon: FileJson,
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-500/10',
      action: () => exportToJSON(history),
    },
    {
      title: t('downloadCSV'),
      description: 'Export data as CSV spreadsheet for Excel or Google Sheets',
      icon: FileSpreadsheet,
      color: 'from-green-500 to-emerald-400',
      bgColor: 'bg-green-500/10',
      action: () => exportToCSV(history),
    },
    {
      title: t('weeklySummary'),
      description: 'Generate a comprehensive weekly report with averages and recommendations',
      icon: FileText,
      color: 'from-purple-500 to-violet-400',
      bgColor: 'bg-purple-500/10',
      action: () => exportWeeklySummary(history),
    },
  ];

  const stats = [
    {
      label: 'Total Readings',
      value: history.length,
      icon: BarChart3,
      color: 'text-blue-500',
    },
    {
      label: 'Monitoring Period',
      value: history.length > 0 
        ? `${Math.round(history.length / 60)} min`
        : '0 min',
      icon: Calendar,
      color: 'text-green-500',
    },
    {
      label: 'Data Points',
      value: history.length * 8,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
  ];

  return (
    <MainLayout>
      <div className="container px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {t('reports')}
              </h1>
              <p className="text-muted-foreground">
                {t('exportReport')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-4 shadow-soft animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <stat.icon className={cn("h-5 w-5", stat.color)} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Report Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {reportTypes.map((report, index) => (
            <div
              key={report.title}
              className="group rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 p-6 shadow-soft hover:shadow-card transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <div className={cn(
                "flex h-14 w-14 items-center justify-center rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110",
                report.bgColor
              )}>
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                  report.color
                )}>
                  <report.icon className="h-5 w-5" />
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {report.description}
              </p>

              <Button
                onClick={report.action}
                className="w-full rounded-xl gap-2"
                disabled={history.length === 0}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-8 rounded-2xl bg-muted/50 border border-border/50 p-6 animate-fade-up" style={{ animationDelay: '600ms' }}>
          <h3 className="font-semibold mb-2">📊 About Report Data</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Reports include all sensor readings collected during your monitoring session. 
            The data is generated from the live sensor simulator and updates every second. 
            For historical data storage and advanced analytics, consider connecting to a backend database.
          </p>
        </div>

        <Chatbot />
      </div>
    </MainLayout>
  );
};

export default Reports;
