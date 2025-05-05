
import React from 'react';
import { Link } from 'react-router-dom';
import { Transaction } from '@/context/TransactionContext';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatTime, getCategoryColor, getCategoryIcon } from '@/utils/dateUtils';
import { Wallet } from 'lucide-react'; 
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
  actionContent
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

  // Get the correct icon component
  const IconComponent = getCategoryIcon(transaction.category);
  
  // Get a lighter version of the category color for the icon background
  const getIconBgColor = () => {
    if (transaction.category.toLowerCase().includes('food')) return "bg-red-500/30";
    if (transaction.category.toLowerCase().includes('transportation')) return "bg-blue-500/30";
    if (transaction.category.toLowerCase().includes('entertainment')) return "bg-purple-500/30";
    if (transaction.category.toLowerCase().includes('shopping')) return "bg-yellow-500/30";
    if (transaction.category.toLowerCase().includes('utilities')) return "bg-teal-500/30";
    if (transaction.category.toLowerCase().includes('health')) return "bg-green-500/30";
    if (transaction.category.toLowerCase().includes('education')) return "bg-orange-500/30";
    if (transaction.category.toLowerCase().includes('travel')) return "bg-pink-500/30";
    if (transaction.category.toLowerCase().includes('savings')) return "bg-blue-400/30";
    return "bg-neon-purple/30";
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
              <div className={`flex-shrink-0 w-10 h-10 ${getIconBgColor()} rounded-full flex items-center justify-center mr-3 shadow-sm`}>
                {React.createElement(IconComponent, { size: 20, className: "text-white" })}
              </div>
              
              {/* Description and time */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center">
                  <h3 className="text-white font-medium text-base truncate mr-2">{transaction.description}</h3>
                  {/* {transaction.isSavings && (
                    <div className="bg-blue-500/20 rounded-full px-1 py-0.5 flex items-center">
                      <Wallet className="h-2 w-2 text-blue-400 mr-0.5" />
                      <span className="text-3xs text-blue-400">Savings</span>
                    </div>
                  )} */}
                </div>
                <div className="flex items-center mt-1 space-x-2">
                  <p className="text-white/50 text-2xs">{formatTime(transaction.date)}</p>
                  <CategoryPill 
                    category={transaction.category} 
                    extraSmall 
                    className="text-2xs" 
                  />
                </div>
                {transaction.remarks && (
                  <p className="text-2xs text-white/60 italic mt-0.5 truncate">{transaction.remarks}</p>
                )}
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
