
import React from 'react';
import { Link } from 'react-router-dom';
import { Transaction } from '@/context/TransactionContext';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatTime, getCategoryColor, getCategoryIcon } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';
import CategoryPill from './CategoryPill';

interface TransactionItemProps {
  transaction: Transaction;
  onEditClick?: (transaction: Transaction) => void;
  onDeleteClick?: (id: string) => void;
  actionContent?: React.ReactNode;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction,
  onEditClick,
  onDeleteClick,
  actionContent
}) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onEditClick) {
      onEditClick(transaction);
    }
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteClick) {
      onDeleteClick(transaction.id);
    }
  };
  
  // Determine card styling based on transaction type
  const getCardBorder = () => {
    if (transaction.isSavings) return "border-l-blue-500";
    if (transaction.isExpense) return "border-l-red-500";
    return "border-l-green-500";
  };
  
  // Format the amount with color based on transaction type
  const getAmountColor = () => {
    if (transaction.isSavings) return "text-blue-400";
    if (transaction.isExpense) return "text-red-400";
    return "text-green-400";
  };
  
  // Get transaction prefix
  const getAmountPrefix = () => {
    if (transaction.isSavings) return "";
    if (transaction.isExpense) return "-";
    return "+";
  };
  
  return (
    <Link to={`/transaction/${transaction.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="block"
      >
        <Card className={`bg-white/5 hover:bg-white/10 border-white/10 border-l-4 ${getCardBorder()} backdrop-blur-sm transition-all overflow-hidden`}>
          <CardContent className="p-0">
            <div className="flex items-center px-3 py-3 md:px-4 w-full">
              {/* Category icon */}
              <div className={`flex-shrink-0 w-10 h-10 ${getCategoryColor(transaction.category)} bg-opacity-20 rounded-full flex items-center justify-center mr-3`}>
                <span className="text-xl">{getCategoryIcon(transaction.category)}</span>
              </div>
              
              {/* Description and time */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center">
                  <h3 className="text-white font-medium text-sm truncate mr-2">{transaction.description}</h3>
                  {transaction.isSavings && (
                    <div className="bg-blue-500/20 rounded-full px-1.5 py-0.5 flex items-center">
                      <PiggyBank className="h-3 w-3 text-blue-400 mr-0.5" />
                      <span className="text-2xs text-blue-400">Savings</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center mt-0.5">
                  <p className="text-white/60 text-xs">{formatTime(transaction.date)}</p>
                  <CategoryPill category={transaction.category} small className="ml-2" />
                </div>
              </div>
              
              {/* Amount and actions */}
              <div className="flex items-center space-x-2">
                <p className={`text-sm font-semibold whitespace-nowrap ${getAmountColor()}`}>
                  {getAmountPrefix()}{formatCurrency(transaction.amount)}
                </p>
                
                <div className="flex items-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleEditClick}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </Button>
                  </motion.div>
                  
                  {/* Render custom action content or fallback to default delete button */}
                  {actionContent ? (
                    actionContent
                  ) : (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleDeleteClick}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/50 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default TransactionItem;
