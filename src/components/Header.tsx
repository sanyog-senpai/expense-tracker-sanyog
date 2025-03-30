
import React from 'react';
import { PlusCircle, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
    <header className={cn('flex items-center justify-between py-2 md:py-4 w-full', className)}>
      <div className="flex flex-col items-start">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-xs md:text-sm text-muted-foreground">Track your finances</p>
      </div>
      <div className="flex space-x-2">
        {onFilterClick && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onFilterClick}
            className="rounded-full h-8 w-8 md:h-10 md:w-10"
          >
            <ArrowUpDown className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        )}
        <Button 
          onClick={onAddClick} 
          className="rounded-full h-8 md:h-10 px-3 md:px-4 text-xs md:text-sm"
        >
          <PlusCircle className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
          New
        </Button>
      </div>
    </header>
  );
};

export default Header;
