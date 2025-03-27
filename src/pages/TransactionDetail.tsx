import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTransactions, Transaction, TransactionProvider } from '@/context/TransactionContext';
import { formatCurrency, formatDate, formatTime, getCategoryIcon } from '@/utils/dateUtils';
import Layout from '@/components/Layout';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CategoryPill from '@/components/CategoryPill';
import { cn } from '@/lib/utils';

// This component needs to be inside the TransactionProvider
const TransactionDetailContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useTransactions();
  
  const transaction = useMemo(() => {
    return state.transactions.find(t => t.id === id);
  }, [state.transactions, id]);
  
  // Calculate balance before and after this transaction
  const balanceInfo = useMemo(() => {
    if (!transaction) return { beforeBalance: 0, afterBalance: 0 };
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...state.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Find current transaction index
    const currentIndex = sortedTransactions.findIndex(t => t.id === id);
    
    if (currentIndex === -1) return { beforeBalance: 0, afterBalance: 0 };
    
    // Calculate balance after this transaction
    let runningBalance = 0;
    for (let i = sortedTransactions.length - 1; i >= currentIndex; i--) {
      const t = sortedTransactions[i];
      runningBalance += t.isExpense ? -t.amount : t.amount;
    }
    
    // Calculate balance before this transaction
    const transactionAmount = transaction.isExpense ? -transaction.amount : transaction.amount;
    const beforeBalance = runningBalance - transactionAmount;
    
    return {
      beforeBalance,
      afterBalance: runningBalance
    };
  }, [state.transactions, transaction, id]);
  
  if (!transaction) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h2 className="text-xl font-semibold text-white">Transaction not found</h2>
          <Button 
            variant="ghost" 
            className="mt-4 text-white/70 hover:text-white"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go back
          </Button>
        </div>
      </Layout>
    );
  }
  
  const { amount, description, date, category, isExpense, remarks } = transaction;
  
  return (
    <Layout>
      <div className="px-1 py-4">
        <Button 
          variant="ghost" 
          className="mb-6 -ml-2 text-white/70 hover:text-white"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <h1 className="text-2xl font-bold text-white mb-6">Transaction Details</h1>
        
        {/* Transaction Overview Card */}
        <Card className="glass-card neon-border overflow-hidden mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                  isExpense ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                )}>
                  <span className="text-2xl">{getCategoryIcon(category)}</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{description}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-white/70">{formatDate(date)} at {formatTime(date)}</span>
                    <CategoryPill category={category} className="text-xs py-0.5 px-2" />
                  </div>
                </div>
              </div>
              <div>
                <p className={cn(
                  "text-2xl font-bold",
                  isExpense ? "text-red-400" : "text-green-400"
                )}>
                  {isExpense ? '-' : '+'}{formatCurrency(amount)}
                </p>
              </div>
            </div>
            
            {remarks && (
              <div className="p-4 bg-white/5 rounded-lg mb-6">
                <p className="text-sm text-white/80">{remarks}</p>
              </div>
            )}
            
            {/* Balance Impact Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white/70">Balance Impact</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/50 mb-1">Balance Before</p>
                  <p className="text-lg font-semibold text-white">{formatCurrency(balanceInfo.beforeBalance)}</p>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-xs text-white/50 mb-1">Balance After</p>
                  <p className="text-lg font-semibold text-white">{formatCurrency(balanceInfo.afterBalance)}</p>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <div className={cn(
                  "py-2 px-6 rounded-full flex items-center",
                  isExpense ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
                )}>
                  <p className="text-sm font-medium">
                    {isExpense ? 'Decreased balance by ' : 'Increased balance by '}
                    {formatCurrency(amount)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Transaction Details List */}
        <div className="glass-card neon-border p-6 rounded-xl">
          <h3 className="text-sm font-medium text-white/70 mb-4">Transaction Information</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-white/10">
              <span className="text-sm text-white/50">Transaction ID</span>
              <span className="text-sm text-white">{transaction.id}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-white/10">
              <span className="text-sm text-white/50">Type</span>
              <span className={isExpense ? "text-sm text-red-400" : "text-sm text-green-400"}>
                {isExpense ? 'Expense' : 'Income'}
              </span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-white/10">
              <span className="text-sm text-white/50">Category</span>
              <CategoryPill category={category} className="text-xs py-0.5 px-2" />
            </div>
            
            <div className="flex justify-between py-3 border-b border-white/10">
              <span className="text-sm text-white/50">Date & Time</span>
              <span className="text-sm text-white">{formatDate(date)} at {formatTime(date)}</span>
            </div>
            
            <div className="flex justify-between py-3">
              <span className="text-sm text-white/50">Amount</span>
              <span className={cn(
                "text-sm font-medium",
                isExpense ? "text-red-400" : "text-green-400"
              )}>
                {isExpense ? '-' : '+'}{formatCurrency(amount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Wrap the component with the TransactionProvider
const TransactionDetail = () => {
  return (
    <TransactionProvider>
      <TransactionDetailContent />
    </TransactionProvider>
  );
};

export default TransactionDetail;
