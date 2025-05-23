
import React from 'react';
import { formatCurrency } from '@/utils/dateUtils';

interface TooltipItemProps {
  name: string;
  value: number;
  index: number;
}

const TooltipItem: React.FC<TooltipItemProps> = ({ name, value, index }) => {
  // Determine the color based on the entry name
  let textColor = "text-blue-400";
  let iconClass = "bg-blue-500";
  let bgGlowClass = ""; 
  
  if (name === 'Expenses') {
    textColor = "text-red-400";
    iconClass = "bg-red-500";
    bgGlowClass = "shadow-red-500/20";
  }
  if (name === 'Income') {
    textColor = "text-green-400";
    iconClass = "bg-green-500";
    bgGlowClass = "shadow-green-500/20";
  }
  if (name === 'Savings') {
    textColor = "text-blue-400";
    iconClass = "bg-blue-500";
    bgGlowClass = "shadow-blue-500/20";
  }
  
  return (
    <div 
      key={`item-${index}`} 
      className={`flex items-center justify-between gap-3 p-1.5 rounded-md transition-all ${bgGlowClass} hover:bg-white/5`}
    >
      <div className="flex items-center">
        <div 
          className={`w-2.5 h-2.5 rounded-full mr-2 ${iconClass} shadow-sm shadow-white/10`}
        ></div>
        <span className="text-xs font-medium text-white/90">{name}</span>
      </div>
      <span className={`text-xs font-semibold ${textColor}`}>
        {formatCurrency(value)}
      </span>
    </div>
  );
};

export default TooltipItem;
