
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import TransactionList from '@/components/TransactionList';
import AddTransaction from '@/components/AddTransaction';
import { TransactionProvider, useTransactions, Transaction } from '@/context/TransactionContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChartBar, List } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const ExpenseTrackerApp = () => {
  const { state, addTransaction, deleteTransaction, updateTransaction } = useTransactions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const { toast } = useToast();
  
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
  
  return (
    <Layout>
      <Header onAddClick={handleAddClick} />
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard" className="flex items-center justify-center">
            <ChartBar className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center justify-center">
            <List className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-4 slide-up">
          <Dashboard transactions={state.transactions} />
          <Separator className="my-4" />
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <TransactionList 
            transactions={state.transactions.slice(0, 5)} 
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-4 slide-up">
          <TransactionList 
            transactions={state.transactions} 
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </TabsContent>
      </Tabs>
      
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
