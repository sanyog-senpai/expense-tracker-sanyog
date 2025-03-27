
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChartBar, List } from 'lucide-react';
import { cn } from '@/lib/utils';

const FloatingNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
      <div className="flex w-[250px] glass-card neon-border backdrop-blur-md rounded-full overflow-hidden">
        <button
          onClick={() => navigate('/')}
          className={cn(
            "flex flex-1 items-center justify-center py-3 px-5 transition-colors",
            path === '/' ? "text-neon-purple" : "text-white/70 hover:text-white"
          )}
        >
          <div className="flex flex-col items-center">
            <ChartBar className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Dashboard</span>
          </div>
        </button>
        
        <div className="w-px h-10 my-auto bg-white/10"></div>
        
        <button
          onClick={() => navigate('/?tab=transactions')}
          className={cn(
            "flex flex-1 items-center justify-center py-3 px-5 transition-colors",
            path === '/' && location.search.includes('tab=transactions') ? "text-neon-purple" : "text-white/70 hover:text-white"
          )}
        >
          <div className="flex flex-col items-center">
            <List className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Transactions</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default FloatingNavigation;
