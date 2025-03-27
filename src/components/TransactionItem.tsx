
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
    <div className="group relative flex items-center justify-between p-4 rounded-xl bg-card hover:bg-accent/50 transition-colors duration-200">
      <div className="flex items-center space-x-4">
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full",
          isExpense ? "bg-red-100" : "bg-green-100"
        )}>
          <span className="text-lg">{getCategoryIcon(category)}</span>
        </div>
        <div>
          <h3 className="text-sm font-medium">{description}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-muted-foreground">
              {formatTime(date)}
            </span>
            <CategoryPill category={category} className="text-[10px] py-0.5 px-2" />
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <span className={cn(
          "font-medium",
          isExpense ? "text-red-500" : "text-green-500"
        )}>
          {isExpense ? '-' : '+'}{formatCurrency(amount)}
        </span>
        <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity duration-200">
          <button 
            onClick={() => onEditClick(transaction)}
            className="p-1 hover:bg-secondary rounded"
          >
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </button>
          <button 
            onClick={() => onDeleteClick(id)}
            className="p-1 hover:bg-secondary rounded"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
