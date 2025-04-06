
import React from 'react';
import { PlusCircle, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

interface HeaderProps {
  onAddClick: () => void;
  onFilterClick?: () => void;
  className?: string;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onAddClick, 
  onFilterClick, 
  className,
  title = "Expense Tracker" 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.header 
      className={cn('flex items-center justify-between py-2 md:py-4 w-full', className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className="flex flex-col items-start"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-xs md:text-sm text-muted-foreground">Track your finances</p>
      </motion.div>
      <motion.div 
        className="flex space-x-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {onFilterClick && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onFilterClick}
              className="rounded-full h-8 w-8 md:h-10 md:w-10 bg-white/10 hover:bg-white/20 border-white/20"
            >
              <ArrowUpDown className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </motion.div>
        )}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={onAddClick} 
            className="rounded-full h-8 md:h-10 px-3 md:px-4 text-xs md:text-sm bg-neon-purple hover:bg-neon-purple/90 shadow-[0_0_10px_rgba(162,105,255,0.3)] hover:shadow-[0_0_15px_rgba(162,105,255,0.5)]"
          >
            <PlusCircle className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
            New
          </Button>
        </motion.div>
      </motion.div>
    </motion.header>
  );
};

export default Header;
