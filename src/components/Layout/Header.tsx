import React from 'react';
import { Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Header: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Page Title */}
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{t('appTitle')}</h1>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <div className="relative">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            <div className="absolute inset-0 animate-ping">
              <Activity className="h-4 w-4 text-primary opacity-75" />
            </div>
          </div>
          <span className="text-xs font-medium text-primary">{t('liveData')}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
