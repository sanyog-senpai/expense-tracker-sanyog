
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import FloatingNavigation from './FloatingNavigation';

interface LayoutProps {
  children: ReactNode;
  onAddClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onAddClick }) => {
  return (
    <div className="min-h-screen bg-purple-dark text-white overflow-x-hidden relative pb-24">
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-20">
        {children}
      </div>
      <FloatingNavigation onAddClick={onAddClick} />
    </div>
  );
};

export default Layout;
