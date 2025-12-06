import React from 'react';
import { Leaf, Activity, Globe, Sun, Moon, Monitor } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { themeMode, setThemeMode, isDark } = useTheme();

  const languageLabels = {
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg animate-pulse-slow" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-tight">{t('appTitle')}</h1>
            <p className="text-xs text-muted-foreground">{t('appSubtitle')}</p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <div className="relative">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            <div className="absolute inset-0 animate-ping">
              <Activity className="h-4 w-4 text-primary opacity-75" />
            </div>
          </div>
          <span className="text-xs font-medium text-primary">{t('liveData')}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-2 rounded-xl hover:bg-secondary"
              >
                <Globe className="h-4 w-4" />
                <span className="font-medium">{languageLabels[language]}</span>
              </Button>
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

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 rounded-xl hover:bg-secondary p-0"
              >
                <ThemeIcon className="h-4 w-4" />
              </Button>
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
        </div>
      </div>
    </header>
  );
};

export default Header;
