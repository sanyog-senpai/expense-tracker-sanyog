
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
  
  // Map category colors to our futuristic neon colors with improved contrast
  const getNeoBgColor = (colorClass: string) => {
    if (colorClass.includes('red')) return 'bg-red-500/30 text-red-300 border-red-400/30';
    if (colorClass.includes('blue')) return 'bg-blue-500/30 text-blue-300 border-blue-400/30';
    if (colorClass.includes('green')) return 'bg-green-500/30 text-green-300 border-green-400/30';
    if (colorClass.includes('yellow')) return 'bg-yellow-500/30 text-yellow-300 border-yellow-400/30';
    if (colorClass.includes('purple')) return 'bg-neon-purple/30 text-neon-purple border-neon-purple/30';
    if (colorClass.includes('pink')) return 'bg-neon-pink/30 text-neon-pink border-neon-pink/30';
    return 'bg-neon-purple/30 text-neon-purple border-neon-purple/30';
  };
  
  const neoBgColor = getNeoBgColor(colorClass);
  
  // For very long category names, allow them to be displayed
  const displayText = () => {
    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
    return capitalized;
  };
  
  // Apply size classes based on props
  let sizeClasses = 'text-2xs md:text-xs py-1 px-2.5';
  
  if (small) {
    sizeClasses = 'text-3xs py-0.5 px-2 leading-tight';
  }
  
  if (extraSmall) {
    sizeClasses = 'text-3xs py-0.5 px-1.5 leading-tight';
  }
  
  // Get the icon component
  const IconComponent = getCategoryIcon(category);
  
  return (
    <div 
      className={cn(
        neoBgColor,
        sizeClasses,
        'font-medium rounded-full',
        'backdrop-blur-md border',
        'transition-all duration-300 hover:scale-105',
        'shadow-sm',
        showIcon ? 'flex items-center' : '',
        className
      )}
    >
      {showIcon && (
        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center mr-1.5 bg-white/20">
          {React.createElement(IconComponent, { size: 12, className: "text-white" })}
        </div>
      )}
      {displayText()}
    </div>
  );
};

export default CategoryPill;
