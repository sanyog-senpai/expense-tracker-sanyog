
import React from 'react';
import Layout from '@/components/Layout';
import { useTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/dateUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { fadeIn, slideUp } from '@/lib/animations';
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
import { Trash2, ArrowLeft } from 'lucide-react';
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
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Financial Details</h1>
        </div>

        <motion.div className="space-y-5" variants={fadeIn}>
          {/* Income Card */}
          <motion.div variants={slideUp} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
            <Card className="border-green-500/30 shadow-lg shadow-green-500/5 bg-gradient-to-br from-green-900/40 to-green-800/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-green-400">Total Income</h3>
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalIncome)}</p>
                <p className="text-xs text-white/60 mt-2">
                  All money received from various sources
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Expenses Card */}
          <motion.div variants={slideUp} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
            <Card className="border-red-500/30 shadow-lg shadow-red-500/5 bg-gradient-to-br from-red-900/40 to-red-800/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-red-400">Total Expenses</h3>
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalExpenses)}</p>
                <p className="text-xs text-white/60 mt-2">
                  All money spent excluding savings
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Savings Card */}
          <motion.div variants={slideUp} initial="initial" animate="animate" transition={{ delay: 0.3 }}>
            <Card className="border-blue-500/30 shadow-lg shadow-blue-500/5 bg-gradient-to-br from-blue-900/40 to-blue-800/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-blue-400">Total Savings</h3>
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalSavings)}</p>
                <p className="text-xs text-white/60 mt-2">
                  All money put aside for future use
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Balance Card */}
          <motion.div variants={slideUp} initial="initial" animate="animate" transition={{ delay: 0.4 }}>
            <Card className="border-purple-500/30 shadow-lg shadow-purple-500/5 bg-gradient-to-br from-purple-900/40 to-purple-800/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-purple-400">Current Balance</h3>
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.balance)}</p>
                <p className="text-xs text-white/60 mt-2">
                  Available balance after expenses and savings
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Clear All Button */}
          <div className="mt-8 flex justify-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-white/5 border-white/10 text-red-400 hover:bg-red-500/10 hover:text-red-400"
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
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default FinancialDetails;
