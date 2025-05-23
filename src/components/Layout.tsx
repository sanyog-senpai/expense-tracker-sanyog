
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
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -40, 0],
            scale: [1, 1.05, 1],
          }} 
          transition={{ 
            repeat: Infinity, 
            duration: 20, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, -20, 0], 
            y: [0, 30, 0],
            scale: [1, 1.03, 1],
          }} 
          transition={{ 
            repeat: Infinity, 
            duration: 15, 
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      <motion.div 
        className="max-w-3xl mx-auto px-4 pt-6 pb-20 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
      <FloatingNavigation onAddClick={onAddClick} />
    </div>
  );
};

export default Layout;
