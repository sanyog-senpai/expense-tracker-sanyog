import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; // Assuming Home renders Index
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute'; // Your ProtectedRoute component
import TransactionDetail from './pages/TransactionDetail'; // Import TransactionDetail
import { CategoryProvider } from './context/CategoryContext'; // Assuming CategoryProvider is needed
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { TransactionProvider } from './context/TransactionContext'; // Import TransactionProvider
import HomePage from './pages/Home';
import { LucideFileChartColumnIncreasing } from 'lucide-react';
import CategoryManagement from './pages/CategoryManagement';

function App() {
  return (
    <AuthProvider> {/* Wrap your routes with AuthProvider */}
      <CategoryProvider> {/* CategoryProvider should wrap routes that need it */}
        <TransactionProvider> {/* <-- Add TransactionProvider here */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><CategoryManagement /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Transaction Detail Route with dynamic ID */}
            <Route path="/transactions/:transactionId" element={<ProtectedRoute><TransactionDetail /></ProtectedRoute>} />

          </Routes>
        </TransactionProvider> {/* <-- Close TransactionProvider */}
      </CategoryProvider>
    </AuthProvider>
  );
}

export default App;
