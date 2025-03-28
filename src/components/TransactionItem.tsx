
import React from 'react';
import { Transaction } from '@/context/TransactionContext';
import { formatCurrency, formatTime, getCategoryIcon } from '@/utils/dateUtils';
import CategoryPill from './CategoryPill';
import { Pencil, Trash2, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

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
  const { id, amount, description, date, category, isExpense, isSavings, savingsPurpose, remarks } = transaction;
  const navigate = useNavigate();
  
  const handleItemClick = () => {
    navigate(`/transaction/${id}`);
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick(transaction);
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClick(id);
  };

  // Determine color based on transaction type
  const getTransactionColor = () => {
    if (isSavings) return "bg-blue-500/20 text-blue-400";
    return isExpense ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400";
  };

  const getAmountColor = () => {
    if (isSavings) return "text-blue-400";
    return isExpense ? "text-red-400" : "text-green-400";
  };
  
  return (
    <div 
      className="group relative flex flex-col p-4 rounded-xl glass-card neon-border glass-hover transition-all duration-300 cursor-pointer"
      onClick={handleItemClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
            getTransactionColor()
          )}>
            <span className="text-lg">
              {isSavings ? <PiggyBank className="h-5 w-5" /> : getCategoryIcon(category)}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{description}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-white/50">
                {formatTime(date)}
              </span>
              <CategoryPill category={category} className="text-[10px] py-0.5 px-2" />
              {isSavings && (
                <span className="bg-blue-500/20 text-blue-400 rounded-full text-[10px] py-0.5 px-2">
                  Savings
                </span>
              )}
            </div>
            {isSavings && savingsPurpose && (
              <p className="text-xs text-blue-300 mt-1">
                Purpose: {savingsPurpose}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <span className={cn(
            "font-medium",
            getAmountColor()
          )}>
            {isExpense ? '-' : '+'}{formatCurrency(amount)}
          </span>
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity duration-200">
            <button 
              onClick={handleEditClick}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <Pencil className="h-4 w-4 text-white/70" />
            </button>
            <button 
              onClick={handleDeleteClick}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>
      
      {remarks && (
        <div className="mt-3 pl-14">
          <p className="text-xs text-white/70 italic">
            {remarks}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionItem;
