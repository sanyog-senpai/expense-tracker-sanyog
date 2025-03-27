
import React from 'react';
import { Transaction } from '@/context/TransactionContext';
import { formatCurrency, formatTime, getCategoryIcon } from '@/utils/dateUtils';
import CategoryPill from './CategoryPill';
import { Pencil, Trash2 } from 'lucide-react';
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
  const { id, amount, description, date, category, isExpense, remarks } = transaction;
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
  
  return (
    <div 
      className="group relative flex flex-col p-4 rounded-xl glass-card neon-border glass-hover transition-all duration-300 cursor-pointer"
      onClick={handleItemClick}
    >
      <div className="flex items-center justify-between">
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
