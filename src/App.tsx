
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TransactionProvider } from './context/TransactionContext';
import { CategoryProvider } from './context/CategoryContext';
import NotFound from './pages/NotFound';
import TransactionDetail from './pages/TransactionDetail';
import Index from './pages/Index';
import CategoryManagement from './pages/CategoryManagement';

const App = () => {
  return (
    <Router>
      <CategoryProvider>
        <TransactionProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/transaction/:id" element={<TransactionDetail />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TransactionProvider>
      </CategoryProvider>
    </Router>
  );
};

export default App;
