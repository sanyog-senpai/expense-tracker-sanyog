
import React from 'react';
import { PlusCircle, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  return (
    <header className={cn('flex items-center justify-between py-4 w-full', className)}>
      <div className="flex flex-col items-start">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">Track your finances</p>
      </div>
      <div className="flex space-x-2">
        {onFilterClick && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onFilterClick}
            className="rounded-full h-10 w-10"
          >
            <ArrowUpDown className="h-5 w-5" />
          </Button>
        )}
        <Button 
          onClick={onAddClick} 
          className="rounded-full"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New
        </Button>
      </div>
    </header>
  );
};

export default Header;
