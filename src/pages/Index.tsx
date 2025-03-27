
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import TransactionList from '@/components/TransactionList';
import AddTransaction from '@/components/AddTransaction';
import { TransactionProvider, useTransactions, Transaction } from '@/context/TransactionContext';
import { useToast } from '@/components/ui/use-toast';

const ExpenseTrackerApp = () => {
  const { state, addTransaction, deleteTransaction, updateTransaction } = useTransactions();
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
    setEditingTransaction(undefined);
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
  
  return (
    <Layout>
      <Header onAddClick={handleAddClick} />
      
      {activeTab === 'dashboard' ? (
        <div className="mt-4 slide-up">
          <Dashboard transactions={state.transactions} />
          <div className="my-6">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <TransactionList 
              transactions={state.transactions.slice(0, 5)} 
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        </div>
      ) : (
        <div className="mt-4 slide-up">
          <TransactionList 
            transactions={state.transactions} 
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </div>
      )}
      
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
