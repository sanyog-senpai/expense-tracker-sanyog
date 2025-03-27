
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div 
        className={cn(
          "container max-w-2xl mx-auto px-4 py-6 space-y-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
