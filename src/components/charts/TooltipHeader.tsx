
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TooltipHeaderProps {
  label?: string;
}

const TooltipHeader: React.FC<TooltipHeaderProps> = ({ label }) => {
  return (
    <h4 className="text-xs font-semibold text-white mb-2.5 border-b border-white/20 pb-2 flex items-center justify-between">
      <Badge variant="neon" className="px-2 py-0.5 text-2xs">{label}</Badge>
      <span className="text-2xs text-white/50">hover data</span>
    </h4>
  );
};

export default TooltipHeader;
