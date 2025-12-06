import React, { ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <main className="pb-24 md:pb-8 md:pl-20">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
