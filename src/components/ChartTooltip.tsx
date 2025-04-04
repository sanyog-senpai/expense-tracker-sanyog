
import React from 'react';
import TooltipItem from './charts/TooltipItem';
import TooltipHeader from './charts/TooltipHeader';
import TooltipContainer from './charts/TooltipContainer';

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
    <TooltipContainer>
      <TooltipHeader label={label} />
      <div className="space-y-3.5">
        {payload.map((entry, index) => (
          <TooltipItem
            key={`tooltip-item-${index}`}
            name={entry.name}
            value={entry.value}
            index={index}
          />
        ))}
      </div>
    </TooltipContainer>
  );
};

export default ChartTooltip;
