
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import TransactionList from '@/components/TransactionList';
import AddTransaction from '@/components/AddTransaction';
import { TransactionProvider, useTransactions, Transaction } from '@/context/TransactionContext';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, pageTransition, staggeredContainer } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

const ExpenseTrackerApp = () => {
  const { state, addTransaction, deleteTransaction, updateTransaction, clearAllTransactions } = useTransactions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions'>(
    tabParam === 'transactions' ? 'transactions' : 'dashboard'
  );
  
  // Update active tab when URL search param changes
  useEffect(() => {
    setActiveTab(tabParam === 'transactions' ? 'transactions' : 'dashboard');
  }, [tabParam]);
  
  const handleAddClick = () => {
    setEditingTransaction(undefined);
    setIsAddModalOpen(true);
  };
  
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsAddModalOpen(true);
  };
  
  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    toast({
      title: "Transaction deleted",
      description: "The transaction has been deleted successfully.",
    });
  };
  
  const handleSaveTransaction = (transaction: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      updateTransaction({
        ...transaction,
        id: editingTransaction.id
      });
      toast({
        title: "Transaction updated",
        description: "The transaction has been updated successfully.",
      });
    } else {
      addTransaction(transaction);
      toast({
        title: "Transaction added",
        description: "The transaction has been added successfully.",
      });
    }
    setIsAddModalOpen(false);
    setEditingTransaction(undefined);
  };

  const handleClearAllTransactions = () => {
    clearAllTransactions();
    toast({
      title: "All transactions cleared",
      description: "Your transaction history has been cleared.",
    });
  };

  const handleTabChange = (tab: 'dashboard' | 'transactions') => {
    setActiveTab(tab);
    // Update URL to reflect tab change
    if (tab === 'dashboard') {
      navigate('/');
    } else {
      navigate('/?tab=transactions');
    }
  };
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.3 
      }
    }
  };
  
  // Show empty state when no transactions
  const hasNoTransactions = state.transactions.length === 0;
  
  return (
    <Layout onAddClick={handleAddClick}>
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggeredContainer(0.1, 0.2)}
      >
        <motion.div variants={fadeIn}>
          <div className="flex justify-between items-center">
            <Header onAddClick={handleAddClick} />
            
            {/* Only show clear all button when there are transactions */}
            {!hasNoTransactions && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/5 border-white/10 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-purple-dark border-white/10">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Clear All Transactions?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/70">
                      This will delete all of your transaction history. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent text-white/70 border-white/10 hover:bg-white/5 hover:text-white">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleClearAllTransactions} 
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div 
              key="dashboard"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-4"
            >
              <Dashboard transactions={state.transactions} />
              <div className="my-6">
                <motion.h2 
                  className="text-xl font-semibold mb-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Recent Transactions
                </motion.h2>
                <TransactionList 
                  transactions={state.transactions.slice(0, 5)} 
                  onEditTransaction={handleEditTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="transactions"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-4"
            >
              <TransactionList 
                transactions={state.transactions} 
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <AddTransaction 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveTransaction}
        editTransaction={editingTransaction}
      />
    </Layout>
  );
};

const Index = () => {
  return (
    <TransactionProvider>
      <ExpenseTrackerApp />
    </TransactionProvider>
  );
};

export default Index;
