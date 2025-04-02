
import React from 'react';
import { getCategoryColor } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryPillProps {
  category: string;
  className?: string;
  small?: boolean;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ category, className, small }) => {
  const colorClass = getCategoryColor(category);
  const isMobile = useIsMobile();
  
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
  
  // For very long category names, truncate them on mobile
  const displayText = () => {
    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
    if (isMobile && capitalized.length > 10) {
      return capitalized.slice(0, 8) + '..';
    }
    return capitalized;
  };
  
  // Apply smaller text and padding if small prop is true
  const sizeClasses = small
    ? 'text-3xs md:text-2xs py-0 md:py-0.5 px-1 md:px-1.5'
    : 'text-2xs md:text-xs py-0.5 md:py-1 px-1.5 md:px-2.5';
  
  return (
    <div 
      className={cn(
        neoBgColor,
        sizeClasses,
        'font-medium rounded-full neon-border',
        'backdrop-blur-sm whitespace-nowrap',
        className
      )}
    >
      {displayText()}
    </div>
  );
};

export default CategoryPill;
