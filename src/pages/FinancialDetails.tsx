
import React from 'react';
import Layout from '@/components/Layout';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/dateUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { fadeIn, slideUp, bounceIn } from '@/lib/animations';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, ArrowLeft, DollarSign, CreditCard, PiggyBank, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const FinancialDetails = () => {
  const { state, clearAllTransactions } = useTransactions();
  const { toast } = useToast();

  // Calculate financial stats
  const stats = React.useMemo(() => {
    const totalIncome = state.transactions
      .filter(t => !t.isExpense)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = state.transactions
      .filter(t => t.isExpense && !t.isSavings)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalSavings = state.transactions
      .filter(t => t.isSavings)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = totalIncome - totalExpenses - totalSavings;
    
    return { totalIncome, totalExpenses, totalSavings, balance };
  }, [state.transactions]);

  const handleClearAllTransactions = () => {
    clearAllTransactions();
    toast({
      title: "All transactions cleared",
      description: "Your transaction history has been cleared.",
    });
  };

  return (
    <Layout>
      <motion.div 
        className="pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header with cash animation */}
        <motion.div 
          className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-br from-purple-800/40 to-indigo-900/60 p-6 shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-500/20 blur-3xl"></div>
          <div className="absolute -left-10 bottom-0 h-20 w-20 rounded-full bg-purple-600/20 blur-2xl"></div>
          
          <div className="flex items-center mb-4">
            <Link to="/" className="mr-3">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Financial Overview</h1>
          </div>
          
          <p className="text-white/70 max-w-md">
            Track your income, expenses, and savings at a glance. Here's where your money is going.
          </p>
          
          {/* Floating dollar signs */}
          <motion.div 
            className="absolute right-6 top-4"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
          >
            <DollarSign size={40} className="text-green-400/80" />
          </motion.div>
          
          <motion.div 
            className="absolute right-16 top-10"
            animate={{ 
              y: [0, -6, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <DollarSign size={28} className="text-green-300/60" />
          </motion.div>
        </motion.div>

        <motion.div className="space-y-5" variants={fadeIn}>
          {/* Income Card */}
          <motion.div variants={slideUp} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
            <Card className="overflow-hidden border-green-500/30 shadow-xl shadow-green-500/10 bg-gradient-to-br from-green-900/40 to-green-800/20">
              <CardContent className="p-5 relative">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 rounded-full bg-green-400/20">
                      <Wallet className="h-5 w-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-medium text-green-400">Total Income</h3>
                  </div>
                  <Badge variant="glass" className="bg-green-400/10 text-green-400 border-green-400/30">
                    Earnings
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalIncome)}</p>
                <p className="text-xs text-white/60 mt-2">
                  All money received from various sources
                </p>
                
                {/* Decorative elements */}
                <motion.div 
                  className="absolute right-3 bottom-3 opacity-20"
                  animate={{ rotate: 15, scale: [0.95, 1.05, 0.95] }}
                  transition={{ repeat: Infinity, duration: 5 }}
                >
                  <DollarSign className="h-12 w-12 text-green-300" />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Expenses Card */}
          <motion.div variants={slideUp} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
            <Card className="overflow-hidden border-red-500/30 shadow-xl shadow-red-500/10 bg-gradient-to-br from-red-900/40 to-red-800/20">
              <CardContent className="p-5 relative">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 rounded-full bg-red-400/20">
                      <CreditCard className="h-5 w-5 text-red-400" />
                    </div>
                    <h3 className="text-lg font-medium text-red-400">Total Expenses</h3>
                  </div>
                  <Badge variant="glass" className="bg-red-400/10 text-red-400 border-red-400/30">
                    Spending
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalExpenses)}</p>
                <p className="text-xs text-white/60 mt-2">
                  All money spent excluding savings
                </p>
                
                {/* Decorative elements */}
                <motion.div 
                  className="absolute -right-2 -bottom-3 opacity-10"
                  animate={{ rotate: -5, scale: [0.98, 1.02, 0.98] }}
                  transition={{ repeat: Infinity, duration: 5, delay: 0.5 }}
                >
                  <CreditCard className="h-20 w-20 text-red-300" />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Savings Card */}
          <motion.div variants={slideUp} initial="initial" animate="animate" transition={{ delay: 0.3 }}>
            <Card className="overflow-hidden border-blue-500/30 shadow-xl shadow-blue-500/10 bg-gradient-to-br from-blue-900/40 to-blue-800/20">
              <CardContent className="p-5 relative">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 rounded-full bg-blue-400/20">
                      <PiggyBank className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-medium text-blue-400">Total Savings</h3>
                  </div>
                  <Badge variant="glass" className="bg-blue-400/10 text-blue-400 border-blue-400/30">
                    Growth
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalSavings)}</p>
                <p className="text-xs text-white/60 mt-2">
                  All money put aside for future use
                </p>
                
                {/* Decorative elements */}
                <motion.div 
                  className="absolute right-6 bottom-2 opacity-20"
                  animate={{ y: [0, -5, 0], rotate: 5 }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <PiggyBank className="h-10 w-10 text-blue-300" />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Balance Card */}
          <motion.div variants={bounceIn} initial="initial" animate="animate" transition={{ delay: 0.4 }}>
            <Card className="overflow-hidden border-purple-500/30 shadow-xl shadow-purple-500/10 bg-gradient-to-br from-purple-900/40 to-purple-800/20">
              <CardContent className="p-5 relative">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 rounded-full bg-purple-400/20">
                      <DollarSign className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium text-purple-400">Current Balance</h3>
                  </div>
                  <Badge variant="glass" className="bg-purple-400/10 text-purple-400 border-purple-400/30">
                    Available
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.balance)}</p>
                <p className="text-xs text-white/60 mt-2">
                  Available balance after expenses and savings
                </p>
                
                {/* Decorative coins */}
                <div className="absolute right-3 -bottom-3 opacity-20 flex space-x-2">
                  <motion.div 
                    className="h-8 w-8 rounded-full bg-yellow-400"
                    animate={{ y: [0, -7, 0], rotate: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5 }}
                  />
                  <motion.div 
                    className="h-6 w-6 rounded-full bg-yellow-300"
                    animate={{ y: [0, -5, 0], rotate: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: 0.2 }}
                  />
                  <motion.div 
                    className="h-4 w-4 rounded-full bg-yellow-200"
                    animate={{ y: [0, -3, 0], rotate: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 3, delay: 0.4 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Clear All Button with improved styling */}
          <motion.div 
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-white/5 border-white/10 text-red-400 hover:bg-red-500/10 hover:text-red-400 px-5 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Transactions
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-purple-dark border-white/10">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Clear All Transactions?</AlertDialogTitle>
                  <AlertDialogDescription className="text-white/70">
                    This will delete all of your transaction history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent text-white/70 border-white/10 hover:bg-white/5 hover:text-white">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearAllTransactions} 
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
          
          {/* Decorative financial elements */}
          <div className="fixed -z-10 inset-0 overflow-hidden opacity-20 pointer-events-none">
            <motion.div 
              className="absolute -top-20 right-10" 
              animate={{ y: [0, 40, 0], rotate: [0, 10, 0] }} 
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            >
              <DollarSign size={100} className="text-green-500/30" />
            </motion.div>
            <motion.div 
              className="absolute top-60 -right-10" 
              animate={{ y: [0, -30, 0], rotate: [0, -5, 0] }} 
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            >
              <DollarSign size={80} className="text-green-500/20" />
            </motion.div>
            <motion.div 
              className="absolute bottom-40 -left-10" 
              animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }} 
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <DollarSign size={120} className="text-green-500/10" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default FinancialDetails;
