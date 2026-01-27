import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sprout, FileText, LogOut, ChevronLeft, ChevronRight, Globe, Sun, Moon, Monitor } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { t, language, setLanguage } = useLanguage();
  const { themeMode, setThemeMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { to: '/crop-recommendation', icon: Sprout, label: t('cropRecommendation') },
    { to: '/reports', icon: FileText, label: t('reports') },
  ];

  const languageLabels = {
    en: 'English',
    hi: 'हिंदी',
    gu: 'ગુજરાતી',
  };

  const languageShort = {
    en: 'EN',
    hi: 'हि',
    gu: 'ગુ',
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    auto: Monitor,
  };

  const ThemeIcon = themeIcons[themeMode];

  const handleLogout = () => {
    toast({
      title: t('logoutSuccess'),
      description: t('logoutMessage'),
    });
    navigate('/signin');
  };

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

        {/* Settings Section */}
        <div className="pt-4 border-t border-border/50 space-y-2">
          <div className={cn(
            "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
            collapsed && "text-center px-0"
          )}>
            {collapsed ? "•••" : t('settings')}
          </div>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full",
                  "hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98]",
                  "text-muted-foreground hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <Globe className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{languageShort[language]}</span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem
                onClick={() => setLanguage('en')}
                className={cn("rounded-lg", language === 'en' && "bg-primary/10")}
              >
                🇺🇸 English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage('hi')}
                className={cn("rounded-lg", language === 'hi' && "bg-primary/10")}
              >
                🇮🇳 हिंदी
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage('gu')}
                className={cn("rounded-lg", language === 'gu' && "bg-primary/10")}
              >
                🇮🇳 ગુજરાતી
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full",
                  "hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98]",
                  "text-muted-foreground hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <ThemeIcon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{t(`${themeMode}Mode`)}</span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem
                onClick={() => setThemeMode('light')}
                className={cn("rounded-lg gap-2", themeMode === 'light' && "bg-primary/10")}
              >
                <Sun className="h-4 w-4" />
                {t('lightMode')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setThemeMode('dark')}
                className={cn("rounded-lg gap-2", themeMode === 'dark' && "bg-primary/10")}
              >
                <Moon className="h-4 w-4" />
                {t('darkMode')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setThemeMode('auto')}
                className={cn("rounded-lg gap-2", themeMode === 'auto' && "bg-primary/10")}
              >
                <Monitor className="h-4 w-4" />
                {t('autoMode')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full",
              "hover:bg-destructive/10 hover:scale-[1.02] active:scale-[0.98]",
              "text-muted-foreground hover:text-destructive",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            {!collapsed && (
              <span className="text-sm font-medium truncate">{t('logout')}</span>
            )}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;