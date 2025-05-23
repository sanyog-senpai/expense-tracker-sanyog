
import React, { useState, useEffect } from 'react';
import { countAnimation } from '@/lib/animations';

interface AnimatedNumberProps {
  value: number;
  formatter?: (value: number) => string;
  duration?: number;
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ 
  value, 
  formatter = (val) => val.toString(), 
  duration = 1000,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = displayValue;
    const { values, frameTime } = countAnimation(start, value, duration);
    let frame = 0;
    
    const interval = setInterval(() => {
      if (frame < values.length) {
        setDisplayValue(values[frame]);
        frame++;
      } else {
        clearInterval(interval);
      }
    }, frameTime);
    
    return () => clearInterval(interval);
  }, [value, duration, displayValue]);
  
  return <span className={className}>{formatter(displayValue)}</span>;
};

export default AnimatedNumber;
