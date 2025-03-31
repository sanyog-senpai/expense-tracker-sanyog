
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TransactionProvider } from './context/TransactionContext';
import NotFound from './pages/NotFound';
import TransactionDetail from './pages/TransactionDetail';
import Index from './pages/Index';

const App = () => {
  return (
    <Router>
      <TransactionProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/transaction/:id" element={<TransactionDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TransactionProvider>
    </Router>
  );
};

export default App;
