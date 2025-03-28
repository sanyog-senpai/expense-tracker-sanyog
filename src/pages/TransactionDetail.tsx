
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTransactions, TransactionProvider } from '@/context/TransactionContext';
import { formatCurrency, formatDate } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PiggyBank, ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  
  const transaction = state.transactions.find(t => t.id === id);
  
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
  
  return (
    <Layout hideNavigation>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5 text-white/70 hover:text-white" />
        </Button>
        <h1 className="text-2xl font-semibold text-white ml-2">Transaction Detail</h1>
      </div>
      
      <div className="glass-card neon-border rounded-lg p-6 space-y-6">
        {/* Transaction Card Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full",
              transaction.isSavings ? "bg-blue-500/20 text-blue-400" : 
              transaction.isExpense ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
            )}>
              {transaction.isSavings ? (
                <PiggyBank className="h-6 w-6" />
              ) : transaction.isExpense ? (
                <ArrowDownRight className="h-6 w-6" />
              ) : (
                <ArrowUpRight className="h-6 w-6" />
              )}
            </div>
            <div>
              <h2 className="text-white text-lg font-medium">{transaction.description}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-white/50">
                  {formatDate(transaction.date)}
                </span>
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
              </div>
            </div>
          </div>
          <div className={`font-semibold text-xl ${amountColor}`}>
            {sign} {formatCurrency(transaction.amount)}
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-4">
          <div>
            <span className="text-white/70 text-sm">Category</span>
            <p className="text-white capitalize">{transaction.category}</p>
          </div>
          <div>
            <span className="text-white/70 text-sm">Date & Time</span>
            <p className="text-white">{formatDate(transaction.date)} • {new Date(transaction.date).toLocaleTimeString()}</p>
          </div>
        </div>
        
        {transaction.savingsPurpose && (
          <div className="bg-blue-500/10 p-4 rounded-md">
            <h3 className="text-blue-400 font-medium flex items-center gap-2 mb-1">
              <PiggyBank className="h-4 w-4" /> Savings Purpose
            </h3>
            <p className="text-white">{transaction.savingsPurpose}</p>
          </div>
        )}
        
        {transaction.remarks && (
          <div className="bg-white/5 p-4 rounded-md">
            <h3 className="text-white/70 font-medium mb-1">Remarks</h3>
            <p className="text-white">{transaction.remarks}</p>
          </div>
        )}

        {/* Balance Impact */}
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-white/70 font-medium mb-3 flex items-center gap-2">
            <Wallet className="h-4 w-4" /> Balance Impact
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-3 rounded-md">
              <span className="text-white/70 text-xs">Before</span>
              <p className={`text-lg font-medium ${beforeBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(beforeBalance)}
              </p>
            </div>
            <div className="glass-card p-3 rounded-md">
              <span className="text-white/70 text-xs">After</span>
              <p className={`text-lg font-medium ${afterBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(afterBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
