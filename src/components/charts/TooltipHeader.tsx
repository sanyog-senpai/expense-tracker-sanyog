
import React from 'react';

interface TooltipHeaderProps {
  label?: string;
}

const TooltipHeader: React.FC<TooltipHeaderProps> = ({ label }) => {
  return (
    <h4 className="text-xs font-semibold text-white mb-2.5 border-b border-white/20 pb-2 flex items-center justify-between">
      <span className="bg-neon-purple/20 rounded px-1.5 py-0.5">{label}</span>
      <span className="text-2xs text-white/50">hover data</span>
    </h4>
  );
};

export default TooltipHeader;
