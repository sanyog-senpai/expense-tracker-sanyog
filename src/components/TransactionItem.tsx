
import React from 'react';
import { Transaction } from '@/context/TransactionContext';
import { formatCurrency, formatTime, getCategoryIcon } from '@/utils/dateUtils';
import CategoryPill from './CategoryPill';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
  onEditClick: (transaction: Transaction) => void;
  onDeleteClick: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction, 
  onEditClick, 
  onDeleteClick 
}) => {
  const { id, amount, description, date, category, isExpense } = transaction;
  
  return (
    <div className="group relative flex items-center justify-between p-4 rounded-xl glass-card neon-border glass-hover transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
          isExpense ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
        )}>
          <span className="text-lg">{getCategoryIcon(category)}</span>
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">{description}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-white/50">
              {formatTime(date)}
            </span>
            <CategoryPill category={category} className="text-[10px] py-0.5 px-2" />
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <span className={cn(
          "font-medium",
          isExpense ? "text-red-400" : "text-green-400"
        )}>
          {isExpense ? '-' : '+'}{formatCurrency(amount)}
        </span>
        <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity duration-200">
          <button 
            onClick={() => onEditClick(transaction)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <Pencil className="h-4 w-4 text-white/70" />
          </button>
          <button 
            onClick={() => onDeleteClick(id)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
