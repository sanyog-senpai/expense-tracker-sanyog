
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTransactions, TransactionProvider } from '@/context/TransactionContext';
import { formatCurrency, formatDate } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  PiggyBank, 
  ArrowDownRight, 
  ArrowUpRight, 
  Wallet, 
  Calendar, 
  Tag, 
  Clock, 
  AlignLeft, 
  CreditCard,
  Share2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

// Wrap the component with the TransactionProvider
const TransactionDetail = () => {
  return (
    <TransactionProvider>
      <TransactionDetailContent />
    </TransactionProvider>
  );
};

export default TransactionDetail;

// This component needs to be inside the TransactionProvider
const TransactionDetailContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useTransactions();
  const isMobile = useIsMobile();
  const [showAnimation, setShowAnimation] = useState(false);
  
  const transaction = state.transactions.find(t => t.id === id);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setShowAnimation(true);
  }, []);
  
  if (!transaction) {
    return (
      <Layout hideNavigation>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <p className="text-white/70">Transaction not found</p>
          <Button 
            variant="ghost" 
            className="mt-4 text-neon-purple"
            onClick={() => navigate('/')}
          >
            Go back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Calculate before and after balance
  const transactionDate = new Date(transaction.date).getTime();
  const previousTransactions = state.transactions
    .filter(t => new Date(t.date).getTime() <= transactionDate && t.id !== transaction.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let beforeBalance = 0;
  for (const t of previousTransactions) {
    if (t.isExpense) {
      beforeBalance -= t.amount;
    } else {
      beforeBalance += t.amount;
    }
  }
  
  // After balance is before balance + current transaction
  const afterBalance = beforeBalance + (transaction.isExpense ? -transaction.amount : transaction.amount);
  
  const sign = transaction.isExpense ? '-' : '+';
  let amountColor = transaction.isExpense ? 'text-red-500' : 'text-green-500';
  if (transaction.isSavings) {
    amountColor = 'text-blue-500';
  }
  
  const getCardGradient = () => {
    if (transaction.isSavings) return 'from-blue-500/20 to-purple-dark/90';
    if (transaction.isExpense) return 'from-red-500/20 to-purple-dark/90';
    return 'from-green-500/20 to-purple-dark/90';
  };

  const getIconBg = () => {
    if (transaction.isSavings) return 'bg-blue-500/20 text-blue-400';
    if (transaction.isExpense) return 'bg-red-500/20 text-red-400';
    return 'bg-green-500/20 text-green-400';
  };
  
  return (
    <Layout hideNavigation>
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-2">
          <ArrowLeft className="h-5 w-5 text-white/70 hover:text-white" />
        </Button>
        <h1 className="text-lg md:text-2xl font-semibold text-white">Transaction Details</h1>
      </div>
      
      {/* Hero Card - Top Section */}
      <div 
        className={cn(
          "relative glass-card neon-border rounded-xl overflow-hidden transition-all duration-500",
          showAnimation ? "opacity-100" : "opacity-0 translate-y-8"
        )}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient()} opacity-50`}></div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full filter blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative p-4 md:p-6 flex flex-col items-center">
          <div className={cn(
            "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 md:mb-4",
            getIconBg()
          )}>
            {transaction.isSavings ? (
              <PiggyBank className="h-8 w-8 md:h-10 md:w-10" />
            ) : transaction.isExpense ? (
              <ArrowDownRight className="h-8 w-8 md:h-10 md:w-10" />
            ) : (
              <ArrowUpRight className="h-8 w-8 md:h-10 md:w-10" />
            )}
          </div>
          
          <h2 className="text-white text-xl md:text-2xl font-semibold text-center mb-1 md:mb-2">
            {transaction.description}
          </h2>
          
          <div className={cn(
            "text-2xl md:text-4xl font-bold mb-2 md:mb-3", amountColor
          )}>
            {sign} {formatCurrency(transaction.amount)}
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                transaction.isSavings ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : 
                transaction.isExpense ? "bg-red-500/20 text-red-400 border-red-500/30" : 
                "bg-green-500/20 text-green-400 border-green-500/30"
              )}
            >
              {transaction.isSavings ? "Savings" : (transaction.isExpense ? "Expense" : "Income")}
            </Badge>
            
            <div className="h-4 w-px bg-white/20"></div>
            
            <span className="text-xs text-white/70">
              {formatDate(transaction.date)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Details Section */}
      <div 
        className={cn(
          "mt-4 space-y-4 transition-all duration-500 delay-100",
          showAnimation ? "opacity-100" : "opacity-0 translate-y-8"
        )}
      >
        {/* Transaction Details */}
        <div className="glass-card neon-border rounded-xl p-4 md:p-5 space-y-4">
          <h3 className="text-sm md:text-base font-medium text-white/90 mb-2 flex items-center">
            <Tag className="h-4 w-4 mr-2 text-neon-purple" /> Transaction Details
          </h3>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="glass-card p-3 rounded-lg">
              <span className="text-2xs md:text-xs text-white/50 block mb-1">Category</span>
              <p className="text-xs md:text-sm text-white font-medium capitalize">{transaction.category}</p>
            </div>
            
            <div className="glass-card p-3 rounded-lg">
              <span className="text-2xs md:text-xs text-white/50 block mb-1">Date</span>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5 text-white/60 mr-1.5" />
                <p className="text-xs md:text-sm text-white font-medium">{formatDate(transaction.date)}</p>
              </div>
            </div>
            
            <div className="glass-card p-3 rounded-lg">
              <span className="text-2xs md:text-xs text-white/50 block mb-1">Time</span>
              <div className="flex items-center">
                <Clock className="h-3 w-3 md:h-3.5 md:w-3.5 text-white/60 mr-1.5" />
                <p className="text-xs md:text-sm text-white font-medium">{new Date(transaction.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
            
            <div className="glass-card p-3 rounded-lg">
              <span className="text-2xs md:text-xs text-white/50 block mb-1">Transaction ID</span>
              <p className="text-xs md:text-sm text-white font-medium truncate">{id?.substring(0, 12)}...</p>
            </div>
          </div>
          
          {transaction.savingsPurpose && (
            <div className="bg-blue-500/10 p-3 md:p-4 rounded-lg">
              <h3 className="text-xs md:text-sm text-blue-400 font-medium flex items-center gap-2 mb-2">
                <PiggyBank className="h-3.5 w-3.5 md:h-4 md:w-4" /> Savings Purpose
              </h3>
              <p className="text-xs md:text-sm text-white">{transaction.savingsPurpose}</p>
            </div>
          )}
          
          {transaction.remarks && (
            <div className="bg-white/5 p-3 md:p-4 rounded-lg">
              <h3 className="text-xs md:text-sm text-white/70 font-medium flex items-center gap-2 mb-2">
                <AlignLeft className="h-3.5 w-3.5 md:h-4 md:w-4" /> Remarks
              </h3>
              <p className="text-xs md:text-sm text-white">{transaction.remarks}</p>
            </div>
          )}
        </div>
        
        {/* Balance Impact */}
        <div 
          className={cn(
            "glass-card neon-border rounded-xl p-4 md:p-5 transition-all duration-500 delay-200",
            showAnimation ? "opacity-100" : "opacity-0 translate-y-8"
          )}
        >
          <h3 className="text-sm md:text-base font-medium text-white/90 mb-4 flex items-center">
            <Wallet className="h-4 w-4 mr-2 text-neon-purple" /> Balance Impact
          </h3>
          
          <div className="flex space-x-3 md:space-x-4">
            <div className="flex-1 glass-card p-3 md:p-4 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-dark/90 to-purple-dark opacity-50"></div>
              <div className="relative">
                <CreditCard className="h-5 w-5 text-white/60 mb-2" />
                <span className="text-2xs md:text-xs text-white/50 block mb-0.5">Before Transaction</span>
                <p className={`text-base md:text-lg font-semibold ${beforeBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(beforeBalance)}
                </p>
              </div>
            </div>
            
            <div className="flex-1 glass-card p-3 md:p-4 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-dark/90 to-purple-dark opacity-50"></div>
              <div className="relative">
                <CreditCard className="h-5 w-5 text-white/60 mb-2" />
                <span className="text-2xs md:text-xs text-white/50 block mb-0.5">After Transaction</span>
                <p className={`text-base md:text-lg font-semibold ${afterBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(afterBalance)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-center space-x-3 md:space-x-4 mt-5">
          <Button 
            onClick={() => navigate('/')}
            variant="outline" 
            className="text-xs md:text-sm py-1.5 md:py-2 px-3 md:px-4 h-9 md:h-10 bg-white/5 hover:bg-white/10 border-white/10 text-white/80"
          >
            Back to Dashboard
          </Button>
          
          <Button 
            variant="outline" 
            className="text-xs md:text-sm py-1.5 md:py-2 px-3 md:px-4 h-9 md:h-10 bg-white/5 hover:bg-white/10 border-white/10 text-white/80"
          >
            <Share2 className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5" />
            Share
          </Button>
        </div>
      </div>
    </Layout>
  );
};
