
import React from 'react';
import { getCategoryColor } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

interface CategoryPillProps {
  category: string;
  className?: string;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ category, className }) => {
  const colorClass = getCategoryColor(category);
  
  return (
    <div 
      className={cn(
        `${colorClass} text-white text-xs font-medium py-1 px-2.5 rounded-full`,
        'bg-opacity-90 backdrop-blur-sm',
        className
      )}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </div>
  );
};

export default CategoryPill;
