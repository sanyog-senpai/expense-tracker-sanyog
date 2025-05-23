
import React from 'react';
import { getCategoryColor, getCategoryIcon } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

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
    if (colorClass.includes('red')) return 'bg-red-500/20 text-red-400 border-red-400/30 hover:bg-red-500/30';
    if (colorClass.includes('blue')) return 'bg-blue-500/20 text-blue-400 border-blue-400/30 hover:bg-blue-500/30';
    if (colorClass.includes('green')) return 'bg-green-500/20 text-green-400 border-green-400/30 hover:bg-green-500/30';
    if (colorClass.includes('yellow')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30 hover:bg-yellow-500/30';
    if (colorClass.includes('purple')) return 'bg-neon-purple/20 text-neon-purple border-neon-purple/30 hover:bg-neon-purple/30';
    if (colorClass.includes('pink')) return 'bg-neon-pink/20 text-neon-pink border-neon-pink/30 hover:bg-neon-pink/30';
    return 'bg-neon-purple/20 text-neon-purple border-neon-purple/30 hover:bg-neon-purple/30';
  };
  
  const neoBgColor = getNeoBgColor(colorClass);
  
  // For very long category names, allow them to be displayed
  const displayText = () => {
    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
    return capitalized;
  };
  
  // Apply size classes based on props
  let sizeClasses = 'py-1 px-2.5';
  
  if (small) {
    sizeClasses = 'py-0.5 px-2';
  }
  
  if (extraSmall) {
    sizeClasses = 'py-0 px-1.5';
  }
  
  // Get the icon component
  const IconComponent = getCategoryIcon(category);
  
  return (
    <Badge 
      className={cn(
        neoBgColor,
        sizeClasses,
        'font-medium backdrop-blur-sm transition-all duration-200 border',
        'shadow-sm hover:shadow-md',
        showIcon ? 'inline-flex items-center gap-1.5' : '',
        className
      )}
    >
      {showIcon && (
        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-white/20">
          {React.createElement(IconComponent, { size: 12 })}
        </div>
      )}
      {displayText()}
    </Badge>
  );
};

export default CategoryPill;
