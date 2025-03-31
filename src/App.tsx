
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransaction';
import { TransactionProvider, useTransactions } from './context/TransactionContext';
import NotFound from './pages/NotFound';
import TransactionDetail from './pages/TransactionDetail';

const Index = () => {
  const { state, addTransaction, deleteTransaction, updateTransaction } = useTransactions();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState<undefined | any>(undefined);

  const handleAddTransaction = (transaction: any) => {
    addTransaction(transaction);
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsAddModalOpen(true);
  };

  const handleSaveTransaction = (transaction: any) => {
    if (editingTransaction) {
      updateTransaction({
        ...transaction,
        id: editingTransaction.id
      });
    } else {
      addTransaction(transaction);
    }
    setEditingTransaction(undefined);
  };

  return (
    <Layout>
      <Dashboard transactions={state.transactions} />
      <TransactionList
        transactions={state.transactions}
        onEditTransaction={handleEditTransaction}
        onDeleteTransaction={deleteTransaction}
      />
      <AddTransaction 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveTransaction}
        editTransaction={editingTransaction}
      />
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg"
      >
        +
      </button>
    </Layout>
  );
};

const App = () => {
  return (
    <TransactionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/transaction/:id" element={<TransactionDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TransactionProvider>
  );
};

export default App;
