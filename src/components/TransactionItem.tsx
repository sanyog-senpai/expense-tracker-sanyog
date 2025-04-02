
import React from 'react';
import { Link } from 'react-router-dom';
import { Transaction } from '@/context/TransactionContext';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatTime, getCategoryColor, getCategoryIcon } from '@/utils/dateUtils';
import { Wallet } from 'lucide-react'; // Changed from PiggyBank to Wallet
import { motion } from 'framer-motion';
import CategoryPill from './CategoryPill';

interface TransactionItemProps {
  transaction: Transaction;
  onEditClick?: (transaction: Transaction) => void;
  onDeleteClick?: (id: string) => void;
  actionContent?: React.ReactNode;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  transaction
}) => {
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
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="block"
      >
        <Card className={`bg-white/5 hover:bg-white/10 border-white/10 border-l-4 ${getCardBorder()} backdrop-blur-sm transition-all overflow-hidden`}>
          <CardContent className="p-0">
            <div className="flex items-center px-3 py-2.5 md:px-4 w-full">
              {/* Category icon */}
              <div className={`flex-shrink-0 w-8 h-8 ${getCategoryColor(transaction.category)} bg-opacity-20 rounded-full flex items-center justify-center mr-3`}>
                <span className="text-lg">{getCategoryIcon(transaction.category)}</span>
              </div>
              
              {/* Description and time */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center">
                  <h3 className="text-white font-medium text-sm truncate mr-2">{transaction.description}</h3>
                  {transaction.isSavings && (
                    <div className="bg-blue-500/20 rounded-full px-1 py-0.5 flex items-center">
                      <Wallet className="h-2.5 w-2.5 text-blue-400 mr-0.5" /> {/* Changed from PiggyBank to Wallet */}
                      <span className="text-3xs text-blue-400">Savings</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center mt-0.5">
                  <p className="text-white/60 text-3xs">{formatTime(transaction.date)}</p>
                  <CategoryPill category={transaction.category} extraSmall className="ml-2" />
                </div>
              </div>
              
              {/* Amount */}
              <div className="flex items-center">
                <p className={`text-sm font-semibold whitespace-nowrap ${getAmountColor()}`}>
                  {getAmountPrefix()}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default TransactionItem;
