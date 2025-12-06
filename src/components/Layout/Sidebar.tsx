import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sprout, FileText, LogIn, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/crop-recommendation', icon: Sprout, label: t('cropRecommendation') },
    { to: '/reports', icon: FileText, label: t('reports') },
  ];

  const authItems = [
    { to: '/signin', icon: LogIn, label: t('signIn') },
    { to: '/signup', icon: UserPlus, label: t('signUp') },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card/95 backdrop-blur-xl border-r border-border/50 shadow-xl transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        "flex items-center h-16 border-b border-border/50 px-4",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg animate-pulse-slow" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Sprout className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-foreground">Smart Soil</h1>
              <p className="text-[10px] text-muted-foreground">Monitoring System</p>
            </div>
          </div>
        )}
        
        {collapsed && (
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg animate-pulse-slow" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Sprout className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-20 z-50 h-6 w-6 rounded-full border border-border bg-background shadow-md hover:bg-secondary"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Navigation */}
      <nav className="flex flex-col h-[calc(100%-4rem)] p-3">
        {/* Main Navigation */}
        <div className="flex-1 space-y-1">
          <div className={cn(
            "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
            collapsed && "text-center px-0"
          )}>
            {collapsed ? "•••" : "Menu"}
          </div>
          
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  "hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98]",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200",
                  !isActive && "group-hover:scale-110"
                )} />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Auth Section */}
        <div className="pt-4 border-t border-border/50 space-y-1">
          <div className={cn(
            "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
            collapsed && "text-center px-0"
          )}>
            {collapsed ? "•••" : "Account"}
          </div>
          
          {authItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  "hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98]",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200",
                  !isActive && "group-hover:scale-110"
                )} />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
