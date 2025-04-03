
import React from 'react';
import { getCategoryColor, getCategoryIcon } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryPillProps {
  category: string;
  className?: string;
  small?: boolean;
  extraSmall?: boolean;
  showIcon?: boolean;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ 
  category, 
  className, 
  small, 
  extraSmall,
  showIcon = false
}) => {
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
    if (isMobile && capitalized.length > 8) {
      return capitalized.slice(0, 6) + '..';
    }
    return capitalized;
  };
  
  // Apply size classes based on props
  let sizeClasses = 'text-2xs md:text-xs py-0.5 px-2';
  
  if (small) {
    sizeClasses = 'text-3xs py-0 px-1.5 leading-tight';
  }
  
  if (extraSmall) {
    sizeClasses = 'text-3xs py-0 px-1 leading-tight';
  }
  
  // Get the icon component
  const IconComponent = getCategoryIcon(category);
  
  return (
    <div 
      className={cn(
        neoBgColor,
        sizeClasses,
        'font-medium rounded-full',
        'backdrop-blur-sm whitespace-nowrap',
        showIcon ? 'flex items-center' : '',
        className
      )}
    >
      {showIcon && (
        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center mr-1.5 bg-white/20">
          {React.createElement(IconComponent, { size: 12 })}
        </div>
      )}
      {displayText()}
    </div>
  );
};

export default CategoryPill;
