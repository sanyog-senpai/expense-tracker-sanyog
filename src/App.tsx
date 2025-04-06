
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TransactionProvider } from './context/TransactionContext';
import { CategoryProvider } from './context/CategoryContext';
import NotFound from './pages/NotFound';
import TransactionDetail from './pages/TransactionDetail';
import Index from './pages/Index';
import CategoryManagement from './pages/CategoryManagement';
import FinancialDetails from './pages/FinancialDetails';
import { Toaster } from './components/ui/toaster';

const App = () => {
  return (
    <Router>
      <CategoryProvider>
        <TransactionProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/transaction/:id" element={<TransactionDetail />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/financial-details" element={<FinancialDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </TransactionProvider>
      </CategoryProvider>
    </Router>
  );
};

export default App;
