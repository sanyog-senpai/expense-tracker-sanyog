
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChartBar, List, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    <motion.div 
      className="fixed bottom-4 left-0 right-0 z-50 flex justify-center"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.3 
      }}
    >
      <motion.div 
        className="flex w-[300px] glass-card neon-border backdrop-blur-md rounded-full overflow-hidden shadow-[0_0_15px_rgba(162,105,255,0.3)]"
        whileHover={{ 
          boxShadow: "0 0 25px rgba(162, 105, 255, 0.5)",
          scale: 1.02
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={() => navigate('/')}
          className={cn(
            "flex flex-1 items-center justify-center py-3 px-3 transition-colors",
            path === '/' && !tabParam ? "text-neon-purple" : "text-white/70 hover:text-white"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex flex-col items-center">
            <ChartBar className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Dashboard</span>
          </div>
        </motion.button>
        
        <motion.button
          onClick={onAddClick}
          className="flex items-center justify-center py-1.5 px-3 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="flex flex-col items-center"
            initial={{ scale: 1 }}
          >
            <motion.div 
              className="h-12 w-12 rounded-full bg-neon-purple flex items-center justify-center 
                       shadow-[0_0_15px_rgba(162,105,255,0.5)]"
              animate={{ 
                boxShadow: ["0 0 10px rgba(162, 105, 255, 0.4)", "0 0 20px rgba(162, 105, 255, 0.7)", "0 0 10px rgba(162, 105, 255, 0.4)"]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <PlusCircle className="h-7 w-7 text-white" />
            </motion.div>
          </motion.div>
        </motion.button>
        
        <motion.button
          onClick={() => navigate('/?tab=transactions')}
          className={cn(
            "flex flex-1 items-center justify-center py-3 px-3 transition-colors",
            path === '/' && tabParam === 'transactions' ? "text-neon-purple" : "text-white/70 hover:text-white"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex flex-col items-center">
            <List className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Transactions</span>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default FloatingNavigation;
