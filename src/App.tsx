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

  return (
    <Layout>
      <Dashboard transactions={state.transactions} />
      <TransactionList
        transactions={state.transactions}
        onEditTransaction={updateTransaction}
        onDeleteTransaction={deleteTransaction}
      />
      <AddTransaction addTransaction={addTransaction} />
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
