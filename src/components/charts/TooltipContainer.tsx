
import React from 'react';

interface TooltipContainerProps {
  children: React.ReactNode;
}

const TooltipContainer: React.FC<TooltipContainerProps> = ({ children }) => {
  return (
    <div className="bg-purple-dark/95 backdrop-blur-lg p-4 rounded-lg border border-white/20 shadow-xl max-w-[230px] animate-fade-in">
      {children}
    </div>
  );
};

export default TooltipContainer;
