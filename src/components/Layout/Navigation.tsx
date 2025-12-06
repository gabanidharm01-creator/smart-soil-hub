import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sprout, FileText, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const Navigation: React.FC = () => {
  const { t } = useLanguage();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/crop-recommendation', icon: Sprout, label: t('cropRecommendation') },
    { to: '/reports', icon: FileText, label: t('reports') },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:bottom-auto md:top-20 md:left-4 md:translate-x-0">
      <div className="flex md:flex-col gap-2 p-2 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-card">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                "hover:bg-primary/10 hover:scale-105 active:scale-95",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="hidden md:block text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
