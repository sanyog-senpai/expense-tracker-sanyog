
import React from 'react';
import { formatCurrency } from '@/utils/dateUtils';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const ChartTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-purple-dark/95 backdrop-blur-lg p-4 rounded-lg border border-white/20 shadow-xl max-w-[230px] animate-fade-in">
      <h4 className="text-xs font-semibold text-white mb-2.5 border-b border-white/20 pb-2 flex items-center justify-between">
        <span className="bg-neon-purple/20 rounded px-1.5 py-0.5">{label}</span>
        <span className="text-2xs text-white/50">hover data</span>
      </h4>
      <div className="space-y-3.5">
        {payload.map((entry, index) => {
          // Determine the color based on the entry name
          let textColor = "text-blue-400";
          let iconClass = "bg-blue-500";
          let bgGlowClass = ""; 
          
          if (entry.name === 'Expenses') {
            textColor = "text-red-400";
            iconClass = "bg-red-500";
            bgGlowClass = "shadow-red-500/20";
          }
          if (entry.name === 'Income') {
            textColor = "text-green-400";
            iconClass = "bg-green-500";
            bgGlowClass = "shadow-green-500/20";
          }
          if (entry.name === 'Savings') {
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
                <span className="text-xs font-medium text-white/90">{entry.name}</span>
              </div>
              <span className={`text-xs font-semibold ${textColor}`}>
                {formatCurrency(entry.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartTooltip;
