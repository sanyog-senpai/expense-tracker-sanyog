
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTransactions, TransactionProvider } from '@/context/TransactionContext';
import { formatCurrency, formatDate } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PiggyBank } from 'lucide-react';

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
      
      <div className="glass-card neon-border rounded-lg p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-white/70">Description</span>
          <span className="text-white">{transaction.description}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">Amount</span>
          <span className={`font-semibold ${amountColor}`}>
            {sign} {formatCurrency(transaction.amount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">Category</span>
          <span className="text-white">{transaction.category}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">Date</span>
          <span className="text-white">{formatDate(transaction.date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">Type</span>
          <span className="flex items-center text-white">
            {transaction.isSavings ? (
              <>
                <PiggyBank className="h-4 w-4 mr-1 text-blue-400" />
                Savings
              </>
            ) : (
              transaction.isExpense ? 'Expense' : 'Income'
            )}
          </span>
        </div>
      </div>
    </Layout>
  );
};
