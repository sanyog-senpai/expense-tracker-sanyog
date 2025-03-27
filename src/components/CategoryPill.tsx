
import React from 'react';
import { getCategoryColor } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

interface CategoryPillProps {
  category: string;
  className?: string;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ category, className }) => {
  const colorClass = getCategoryColor(category);
  
  // Map category colors to our futuristic neon colors
  const getNeoBgColor = (colorClass: string) => {
    if (colorClass.includes('red')) return 'bg-red-500/20 text-red-400';
    if (colorClass.includes('blue')) return 'bg-blue-500/20 text-blue-400';
    if (colorClass.includes('green')) return 'bg-green-500/20 text-green-400';
    if (colorClass.includes('yellow')) return 'bg-yellow-500/20 text-yellow-400';
    if (colorClass.includes('purple')) return 'bg-neon-purple/20 text-neon-purple';
    if (colorClass.includes('pink')) return 'bg-neon-pink/20 text-neon-pink';
    return 'bg-neon-purple/20 text-neon-purple';
  };
  
  const neoBgColor = getNeoBgColor(colorClass);
  
  return (
    <div 
      className={cn(
        neoBgColor,
        'text-xs font-medium py-1 px-2.5 rounded-full neon-border',
        'backdrop-blur-sm',
        className
      )}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </div>
  );
};

export default CategoryPill;
