
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChartBar, List, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingNavigationProps {
  onAddClick?: () => void;
}

const FloatingNavigation: React.FC<FloatingNavigationProps> = ({ onAddClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
      <div className="flex w-[320px] glass-card neon-border backdrop-blur-md rounded-full overflow-hidden">
        <button
          onClick={() => navigate('/')}
          className={cn(
            "flex flex-1 items-center justify-center py-3 px-4 transition-colors",
            path === '/' && !tabParam ? "text-neon-purple" : "text-white/70 hover:text-white"
          )}
        >
          <div className="flex flex-col items-center">
            <ChartBar className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Dashboard</span>
          </div>
        </button>
        
        <button
          onClick={onAddClick}
          className="flex items-center justify-center py-2 px-4 transition-colors"
        >
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-neon-purple flex items-center justify-center">
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </button>
        
        <button
          onClick={() => navigate('/?tab=transactions')}
          className={cn(
            "flex flex-1 items-center justify-center py-3 px-4 transition-colors",
            path === '/' && tabParam === 'transactions' ? "text-neon-purple" : "text-white/70 hover:text-white"
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
