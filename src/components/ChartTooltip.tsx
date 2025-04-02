
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
    <div className="bg-purple-dark/95 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-lg">
      <h4 className="text-xs font-semibold text-white mb-1">{label}</h4>
      <div className="space-y-1.5">
        {payload.map((entry, index) => {
          // Determine the color based on the entry name
          let textColor = "text-blue-400";
          if (entry.name === 'Expenses') textColor = "text-red-400";
          if (entry.name === 'Income') textColor = "text-green-400";
          
          return (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3">
              <div className="flex items-center">
                <div 
                  className="w-2 h-2 rounded-full mr-1.5"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-xs text-white/80">{entry.name}</span>
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
