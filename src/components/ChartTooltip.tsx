
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
    <div className="bg-purple-dark/95 backdrop-blur-lg p-4 rounded-lg border border-white/20 shadow-xl max-w-[220px]">
      <h4 className="text-xs font-semibold text-white mb-2 border-b border-white/20 pb-2">{label}</h4>
      <div className="space-y-3">
        {payload.map((entry, index) => {
          // Determine the color based on the entry name
          let textColor = "text-blue-400";
          let iconClass = "bg-blue-500";
          if (entry.name === 'Expenses') {
            textColor = "text-red-400";
            iconClass = "bg-red-500";
          }
          if (entry.name === 'Income') {
            textColor = "text-green-400";
            iconClass = "bg-green-500";
          }
          
          return (
            <div key={`item-${index}`} className="flex items-center justify-between gap-2">
              <div className="flex items-center">
                <div 
                  className={`w-2.5 h-2.5 rounded-full mr-2 ${iconClass}`}
                ></div>
                <span className="text-xs text-white/90">{entry.name}</span>
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
