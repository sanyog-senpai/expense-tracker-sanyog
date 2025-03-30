
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTransactions, TransactionProvider } from '@/context/TransactionContext';
import { formatCurrency, formatDate } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  PiggyBank, 
  ArrowDownRight, 
  ArrowUpRight, 
  Wallet, 
  Calendar, 
  Tag, 
  Clock, 
  AlignLeft, 
  CreditCard,
  Share2,
  ExternalLink,
  ChevronRight,
  Download,
  Banknote,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

// Wrap the component with the TransactionProvider
const TransactionDetail = () => {
  return (
    <TransactionProvider>
      <TransactionDetailContent />
    </TransactionProvider>
  );
};

export default TransactionDetail;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

// This component needs to be inside the TransactionProvider
const TransactionDetailContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useTransactions();
  const isMobile = useIsMobile();
  const [showAnimation, setShowAnimation] = useState(false);
  
  const transaction = state.transactions.find(t => t.id === id);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setShowAnimation(true);
    
    // Smooth scroll to top when component mounts
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  
  if (!transaction) {
    return (
      <Layout hideNavigation>
        <motion.div 
          className="flex flex-col items-center justify-center h-[60vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-white/70">Transaction not found</p>
          <Button 
            variant="ghost" 
            className="mt-4 text-neon-purple"
            onClick={() => navigate('/')}
          >
            Go back to Dashboard
          </Button>
        </motion.div>
      </Layout>
    );
  }
  
  // Calculate before and after balance
  const transactionDate = new Date(transaction.date).getTime();
  const previousTransactions = state.transactions
    .filter(t => new Date(t.date).getTime() <= transactionDate && t.id !== transaction.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let beforeBalance = 0;
  for (const t of previousTransactions) {
    if (t.isExpense) {
      beforeBalance -= t.amount;
    } else {
      beforeBalance += t.amount;
    }
  }
  
  // After balance is before balance + current transaction
  const afterBalance = beforeBalance + (transaction.isExpense ? -transaction.amount : transaction.amount);
  
  const sign = transaction.isExpense ? '-' : '+';
  let amountColor = transaction.isExpense ? 'text-red-500' : 'text-green-500';
  if (transaction.isSavings) {
    amountColor = 'text-blue-500';
  }
  
  const getCardGradient = () => {
    if (transaction.isSavings) return 'from-blue-500/20 to-purple-dark/90';
    if (transaction.isExpense) return 'from-red-500/20 to-purple-dark/90';
    return 'from-green-500/20 to-purple-dark/90';
  };

  const getIconBg = () => {
    if (transaction.isSavings) return 'bg-blue-500/20 text-blue-400';
    if (transaction.isExpense) return 'bg-red-500/20 text-red-400';
    return 'bg-green-500/20 text-green-400';
  };

  const typeLabel = transaction.isSavings ? "Savings" : (transaction.isExpense ? "Expense" : "Income");
  
  return (
    <Layout hideNavigation>
      <motion.div
        initial="hidden"
        animate={showAnimation ? "visible" : "hidden"}
        variants={containerVariants}
        className="pb-16"
      >
        {/* Header with back button and title */}
        <motion.div 
          className="flex items-center mb-4 md:mb-6"
          variants={itemVariants}
        >
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="mr-3 h-9 w-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white/80" />
          </motion.button>
          <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Transaction Details
          </h1>
        </motion.div>
        
        {/* Hero Card - Top Section */}
        <motion.div 
          variants={fadeInScale}
          className="relative glass-card neon-border rounded-xl overflow-hidden transition-all duration-500 mb-5 md:mb-7"
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getCardGradient()} opacity-50`}></div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full filter blur-3xl"></div>
          </div>
          
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/40 rounded-full"
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.4, 0.8, 0.4] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/40 rounded-full"
              animate={{ 
                y: [0, -30, 0],
                opacity: [0.3, 0.7, 0.3] 
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-white/30 rounded-full"
              animate={{ 
                y: [0, -25, 0],
                opacity: [0.3, 0.6, 0.3] 
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>
          
          {/* Content */}
          <div className="relative p-5 md:p-7 flex flex-col items-center">
            <motion.div 
              className={cn(
                "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 md:mb-4",
                getIconBg()
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {transaction.isSavings ? (
                <PiggyBank className="h-8 w-8 md:h-10 md:w-10" />
              ) : transaction.isExpense ? (
                <ArrowDownRight className="h-8 w-8 md:h-10 md:w-10" />
              ) : (
                <ArrowUpRight className="h-8 w-8 md:h-10 md:w-10" />
              )}
            </motion.div>
            
            <motion.h2 
              className="text-white text-xl md:text-2xl font-semibold text-center mb-1 md:mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {transaction.description}
            </motion.h2>
            
            <motion.div 
              className={cn(
                "text-2xl md:text-4xl font-bold mb-2 md:mb-3", amountColor
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {sign} {formatCurrency(transaction.amount)}
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-2 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  transaction.isSavings ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : 
                  transaction.isExpense ? "bg-red-500/20 text-red-400 border-red-500/30" : 
                  "bg-green-500/20 text-green-400 border-green-500/30"
                )}
              >
                {typeLabel}
              </Badge>
              
              <div className="h-4 w-px bg-white/20"></div>
              
              <span className="text-xs text-white/70">
                {formatDate(transaction.date)}
              </span>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Details Section */}
        <motion.div 
          variants={itemVariants}
          className="space-y-5 md:space-y-6"
        >
          {/* Transaction Details */}
          <motion.div 
            variants={itemVariants}
            className="glass-card neon-border rounded-xl p-5 md:p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm md:text-base font-medium text-white/90 flex items-center">
                <Tag className="h-4 w-4 mr-2 text-neon-purple" /> Transaction Details
              </h3>
              <Badge variant="outline" className="text-xs bg-white/5 text-white/70 border-white/10">
                #{id?.substring(0, 6)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <motion.div 
                className="glass-card p-3 md:p-4 rounded-lg hover:bg-white/5 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-2xs md:text-xs text-white/50 block mb-1">Category</span>
                <p className="text-xs md:text-sm text-white font-medium capitalize flex items-center">
                  <Tag className="h-3 w-3 mr-1.5 text-white/60" />
                  {transaction.category}
                </p>
              </motion.div>
              
              <motion.div 
                className="glass-card p-3 md:p-4 rounded-lg hover:bg-white/5 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-2xs md:text-xs text-white/50 block mb-1">Date</span>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5 text-white/60 mr-1.5" />
                  <p className="text-xs md:text-sm text-white font-medium">{formatDate(transaction.date)}</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="glass-card p-3 md:p-4 rounded-lg hover:bg-white/5 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-2xs md:text-xs text-white/50 block mb-1">Time</span>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 md:h-3.5 md:w-3.5 text-white/60 mr-1.5" />
                  <p className="text-xs md:text-sm text-white font-medium">{new Date(transaction.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="glass-card p-3 md:p-4 rounded-lg hover:bg-white/5 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-2xs md:text-xs text-white/50 block mb-1">Type</span>
                <div className="flex items-center">
                  <Banknote className="h-3 w-3 md:h-3.5 md:w-3.5 text-white/60 mr-1.5" />
                  <span className={`text-xs md:text-sm font-medium ${
                    transaction.isSavings ? "text-blue-400" : 
                    transaction.isExpense ? "text-red-400" : "text-green-400"
                  }`}>
                    {typeLabel}
                  </span>
                </div>
              </motion.div>
            </div>
            
            {transaction.savingsPurpose && (
              <motion.div 
                className="bg-blue-500/10 p-4 md:p-5 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h3 className="text-xs md:text-sm text-blue-400 font-medium flex items-center gap-2 mb-2.5">
                  <PiggyBank className="h-3.5 w-3.5 md:h-4 md:w-4" /> Savings Purpose
                </h3>
                <p className="text-xs md:text-sm text-white">{transaction.savingsPurpose}</p>
              </motion.div>
            )}
            
            {transaction.remarks && (
              <motion.div 
                className="bg-white/5 p-4 md:p-5 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <h3 className="text-xs md:text-sm text-white/70 font-medium flex items-center gap-2 mb-2.5">
                  <AlignLeft className="h-3.5 w-3.5 md:h-4 md:w-4" /> Notes
                </h3>
                <p className="text-xs md:text-sm text-white leading-relaxed">{transaction.remarks}</p>
              </motion.div>
            )}
          </motion.div>
          
          {/* Balance Impact */}
          <motion.div 
            variants={itemVariants}
            className="glass-card neon-border rounded-xl p-5 md:p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm md:text-base font-medium text-white/90 flex items-center">
                <Wallet className="h-4 w-4 mr-2 text-neon-purple" /> Balance Impact
              </h3>
              <Sparkles className="h-4 w-4 text-neon-purple animate-pulse-subtle" />
            </div>
            
            <div className="flex space-x-3 md:space-x-4">
              <motion.div 
                className="flex-1 glass-card relative overflow-hidden rounded-xl"
                whileHover={{ scale: 1.03 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-dark/90 to-purple-dark"></div>
                <div className="relative p-4 md:p-5">
                  <div className="flex items-center mb-3">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center mr-3">
                      <CreditCard className="h-4 w-4 text-neon-purple" />
                    </div>
                    <div>
                      <p className="text-2xs md:text-xs text-white/60">Before</p>
                      <p className={`text-sm md:text-base font-semibold ${beforeBalance >= 0 ? 'text-green-400' : 'text-red-400'} mt-0.5`}>
                        {formatCurrency(beforeBalance)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-white/10 my-3"></div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-2xs md:text-xs text-white/60">Transaction</p>
                    <p className={`text-xs md:text-sm font-medium ${transaction.isExpense ? 'text-red-400' : 'text-green-400'}`}>
                      {transaction.isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <div className="flex items-center justify-center">
                <div className="w-6 h-px bg-white/20 mx-1 md:mx-2"></div>
                <ChevronRight className="h-4 w-4 text-white/40" />
                <div className="w-6 h-px bg-white/20 mx-1 md:mx-2"></div>
              </div>
              
              <motion.div 
                className="flex-1 glass-card relative overflow-hidden rounded-xl"
                whileHover={{ scale: 1.03 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-dark/90 to-purple-dark"></div>
                <div className="relative p-4 md:p-5">
                  <div className="flex items-center mb-3">
                    <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center mr-3">
                      <CreditCard className="h-4 w-4 text-neon-purple" />
                    </div>
                    <div>
                      <p className="text-2xs md:text-xs text-white/60">After</p>
                      <p className={`text-sm md:text-base font-semibold ${afterBalance >= 0 ? 'text-green-400' : 'text-red-400'} mt-0.5`}>
                        {formatCurrency(afterBalance)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-white/10 my-3"></div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-2xs md:text-xs text-white/60">Change</p>
                    <p className={`text-xs md:text-sm font-medium ${afterBalance - beforeBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {afterBalance - beforeBalance >= 0 ? '+' : ''}{formatCurrency(afterBalance - beforeBalance)}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Actions */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-purple-dark via-purple-dark/95 to-transparent z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="container max-w-2xl mx-auto flex items-center justify-center space-x-3 md:space-x-4">
            <motion.button 
              onClick={() => navigate('/')}
              className="flex-1 h-10 md:h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-xs md:text-sm text-white/80 font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5" />
              Back
            </motion.button>
            
            <motion.button
              className="h-10 md:h-12 px-4 md:px-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-xs md:text-sm text-white/80 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5" />
              Share
            </motion.button>
            
            <motion.button 
              className="h-10 md:h-12 px-4 md:px-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-xs md:text-sm text-white/80 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5" />
              Export
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};
