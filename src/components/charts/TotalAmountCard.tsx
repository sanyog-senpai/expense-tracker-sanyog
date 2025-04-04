
import React from 'react';
import { CalculatorIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/dateUtils';

interface TotalAmountCardProps {
  totalAmount: number;
  dataType: 'expenses' | 'income' | 'savings';
  comparisonType: 'none' | 'month' | 'year' | 'combined';
  yearFilter?: string;
}

const TotalAmountCard: React.FC<TotalAmountCardProps> = ({
  totalAmount,
  dataType,
  comparisonType,
  yearFilter
}) => {
  return (
    <Card className="mb-4 p-3 bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CalculatorIcon className="h-4 w-4 mr-2 text-neon-purple" />
          <span className="text-xs md:text-sm text-white/80">
            Total {dataType.charAt(0).toUpperCase() + dataType.slice(1)}
            {comparisonType !== 'none' ? (
              comparisonType === 'month' 
                ? ` (${yearFilter})` 
                : comparisonType === 'year' 
                  ? ' (All Years)' 
                  : ' (Combined)'
            ) : ''}:
          </span>
        </div>
        <span className="text-sm md:text-base font-semibold text-white">
          {formatCurrency(totalAmount)}
        </span>
      </div>
    </Card>
  );
};

export default TotalAmountCard;
