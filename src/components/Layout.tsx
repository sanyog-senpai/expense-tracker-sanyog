
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import FloatingNavigation from './FloatingNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  hideNavigation?: boolean;
  onAddClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className, 
  hideNavigation = false,
  onAddClick
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-dark via-background to-background overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-60 h-60 bg-neon-purple/10 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-neon-blue/10 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-neon-pink/10 rounded-full filter blur-3xl opacity-30"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        <div 
          className={cn(
            "container max-w-2xl mx-auto px-3 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6 pb-24", // Adjusted padding for mobile
            className
          )}
        >
          {children}
        </div>
      </div>
      
      {/* Floating navigation */}
      {!hideNavigation && <FloatingNavigation onAddClick={onAddClick} />}
    </div>
  );
};

export default Layout;
