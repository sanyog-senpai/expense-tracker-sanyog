import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTransactions, Transaction } from '@/context/TransactionContext';
import { formatCurrency, formatDate, formatTime, getCategoryColor, getCategoryIcon } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Calendar, Clock, Edit, Trash2, ArrowDown, ArrowUp } from 'lucide-react';
import CategoryPill from '@/components/CategoryPill';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AddTransaction from '@/components/AddTransaction';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const TransactionDetail: React.FC = () => {
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { transactionId } = useParams<{ transactionId: string }>();
  const { state, deleteTransaction, updateTransaction } = useTransactions();
  const navigate = useNavigate();

  // Find the transaction using useMemo
  const transaction = useMemo(() => {
    if (!state.transactions) return undefined;
    return state.transactions.find(t => t.id === transactionId);
  }, [transactionId, state.transactions]);

  // Calculate the balances before and after this transaction
  // Calculate the balances before and after this transaction
  const balanceDetails = useMemo(() => {
    if (!transaction || !state.transactions) return { beforeBalance: 0, afterBalance: 0 };

    // Sort transactions by date (oldest first to get chronological order)
    const sortedTransactions = [...state.transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Find the index of the current transaction
    const transactionIndex = sortedTransactions.findIndex(t => t.id === transactionId);

    if (transactionIndex === -1) return { beforeBalance: 0, afterBalance: 0 };

    // Calculate balance before this transaction (all transactions before this one)
    let beforeBalance = 0;
    for (let i = 0; i < transactionIndex; i++) {
      const t = sortedTransactions[i];
      if (!t.isExpense) {
        beforeBalance += t.amount; // Income adds to balance
      } else {
        beforeBalance -= t.amount; // Expense or savings reduces balance
      }
    }

    // Calculate balance after this transaction (including this one)
    let afterBalance = beforeBalance;
    if (!transaction.isExpense) {
      afterBalance += transaction.amount; // Income adds to balance
    } else {
      afterBalance -= transaction.amount; // Expense or savings reduces balance
    }

    return { beforeBalance, afterBalance };
  }, [transaction, state.transactions, transactionId]);

  const handleDelete = () => {
    if (transactionId) {
      deleteTransaction(transactionId);
      toast({
        title: 'Transaction deleted',
        description: 'The transaction has been successfully deleted.'
      });
      navigate('/');
    }
  };

  const handleEdit = (updatedTransaction: Omit<Transaction, 'id'>) => {
    if (transactionId && transaction) {
      updateTransaction({
        ...updatedTransaction,
        id: transactionId
      });
      toast({
        title: 'Transaction updated',
        description: 'The transaction has been successfully updated.'
      });
      setIsEditModalOpen(false);
    }
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-purple-dark p-4 md:p-6 flex items-center justify-center">
        <div className="animate-pulse text-white/70">Loading transaction details...</div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-purple-dark p-4 md:p-6">
        <div className="max-w-lg mx-auto">
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 mb-6"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Transactions
          </Button>

          <Card className="border-white/10 bg-white/5 overflow-hidden shadow-xl">
            <CardContent className="p-6 md:p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="h-8 w-8 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Transaction Not Found</h2>
              <p className="text-white/70 mb-6">This transaction may have been deleted or doesn't exist.</p>
              <Button
                onClick={() => navigate('/')}
                className="bg-neon-purple hover:bg-neon-purple/90"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getBgColor = () => {
    if (transaction.isSavings) return 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-400/30';
    if (transaction.isExpense) return 'bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-400/30';
    return 'bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-400/30';
  };

  const getTextColor = () => {
    if (transaction.isSavings) return 'text-blue-400';
    if (transaction.isExpense) return 'text-red-400';
    return 'text-green-400';
  };

  const getTypeText = () => {
    if (transaction.isSavings) return 'Savings';
    if (transaction.isExpense) return 'Expense';
    return 'Income';
  };

  const getBalanceChangeIcon = () => {
    if (transaction.isSavings) {
      return <ArrowDown className="h-4 w-4 text-blue-400" />;
    }
    if (transaction.isExpense) {
      return <ArrowDown className="h-4 w-4 text-red-400" />;
    }
    return <ArrowUp className="h-4 w-4 text-green-400" />;
  };

  return (
    <div className="min-h-screen bg-purple-dark p-4 md:p-6">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 mb-6"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Transactions
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-white/10 overflow-hidden">
            <div className={`${getBgColor()} p-6 md:p-8`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/10`}>
                      {React.createElement(getCategoryIcon(transaction.category), {
                        size: 18,
                        className: getCategoryColor(transaction.category)
                      })}
                    </div>
                    <h1 className="text-lg md:text-xl font-bold text-white/90">
                      {transaction.description}
                    </h1>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-white/70 text-xs">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        {formatDate(transaction.date)}
                      </div>
                      <div className="flex items-center text-white/70 text-xs">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        {formatTime(transaction.date)}
                      </div>
                    </div>
                    <div>
                      <CategoryPill category={transaction.category} showIcon className="self-start mt-1" />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-neon-purple/10 hover:bg-neon-purple/20 border-neon-purple/30 text-neon-purple h-8 w-8"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400 h-8 w-8"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-purple-dark border-white/10">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Confirm Deletion</AlertDialogTitle>
                          <AlertDialogDescription className="text-white/70">
                            Are you sure you want to delete this transaction? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-transparent text-white/70 border-white/10 hover:bg-white/5 hover:text-white">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </motion.div>
                </div>
              </div>

              <div className="flex flex-col items-center md:flex-row md:justify-between bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10 mt-5">
                <div className="mb-3 md:mb-0">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 mb-2">
                    {getBalanceChangeIcon()}
                    <span className={`text-xs font-medium ${getTextColor()} ml-1.5`}>
                      {getTypeText()}
                    </span>
                  </div>
                  <p className={`text-2xl md:text-3xl font-bold ${getTextColor()}`}>
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>

                {transaction.isSavings && transaction.savingsPurpose && (
                  <div className="bg-blue-500/20 px-3 py-2 rounded-md border border-blue-400/30">
                    <p className="text-white/60 text-2xs mb-0.5">Savings Purpose</p>
                    <p className="text-blue-300 text-sm font-medium">{transaction.savingsPurpose}</p>
                  </div>
                )}
              </div>

              {/* Balance Before & After Section */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/10">
                  <p className="text-white/50 text-2xs mb-1">Balance Before</p>
                  <p className="text-white/90 text-sm font-semibold">{formatCurrency(balanceDetails.beforeBalance)}</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/10">
                  <p className="text-white/50 text-2xs mb-1">Balance After</p>
                  <div className="flex items-center flex-wrap gap-2 sm:gap-0">
                    <p className="text-white/90 text-sm font-semibold">{formatCurrency(balanceDetails.afterBalance)}</p>
                    <div className=" flex items-center ml-0 sm:ml-2 text-2xs px-1.5 py-0.5 bg-white/5 rounded-full">
                      {getBalanceChangeIcon()}
                      <span className={`ml-0.5 ${getTextColor()}`}>
                        {formatCurrency(Math.abs(balanceDetails.afterBalance - balanceDetails.beforeBalance))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {transaction.remarks && (
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-white/80 mb-2">Notes</h3>
                <p className="text-white/70 text-sm whitespace-pre-wrap rounded-md bg-white/5 p-3 border border-white/10">
                  {transaction.remarks}
                </p>
              </CardContent>
            )}
          </Card>
        </motion.div>
      </div>

      <AddTransaction
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEdit}
        editTransaction={transaction}
      />
    </div>
  );
};

export default TransactionDetail;