
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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

      {/* Categories button (fixed on the left) */}
      <Link to="/categories">
        <motion.div
          className="fixed left-4 bottom-28 md:bottom-28 z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            className="bg-white/10 hover:bg-white/20 text-white border border-white/10"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M1.5 5h4V1.5h-4V5z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.5 5h4V1.5h-4V5z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1.5 13h4V9.5h-4V13z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.5 13h4V9.5h-4V13z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Categories
          </Button>
        </motion.div>
      </Link>
      
      <FloatingNavigation onAddClick={onAddClick} />
    </div>
  );
};

export default Layout;
