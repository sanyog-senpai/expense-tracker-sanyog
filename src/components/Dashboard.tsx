
import React, { useMemo } from 'react';
import { Transaction } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/dateUtils';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Wallet, CreditCard, PiggyBank } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import ExpenseChart from './ExpenseChart';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '@/lib/animations';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const isMobile = useIsMobile();
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => !t.isExpense)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = transactions
      .filter(t => t.isExpense && !t.isSavings)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalSavings = transactions
      .filter(t => t.isSavings)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = totalIncome - totalExpenses - totalSavings;
    
    return { totalIncome, totalExpenses, totalSavings, balance };
  }, [transactions]);
  
  return (
    <motion.div 
      className="space-y-5 mb-6"
      initial={fadeIn.initial}
      animate={fadeIn.animate}
      transition={{ duration: 0.4, staggerChildren: 0.1 }}
    >
      {/* Modern Finance Card */}
      <motion.div 
        className="card-3d"
        initial={slideUp.initial}
        animate={slideUp.animate}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="card-inner-3d">
          <Card className="glass-card relative h-auto overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-purple-dark to-black/60">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-purple/20 rounded-full filter blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-neon-blue/20 rounded-full filter blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-20 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 rotate-45 filter blur-xl"></div>
            </div>
            
            <CardContent className="p-5 md:p-6 relative">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2 className="text-xs font-medium text-white/70 mb-1">Available Balance</h2>
                  <div className="flex items-baseline">
                    <AnimatedNumber
                      value={stats.balance}
                      formatter={(value) => formatCurrency(value)}
                      className={`${isMobile ? "text-2xl" : "text-3xl"} font-bold text-white`}
                    />
                  </div>
                </div>
                <div className="p-2 rounded-full bg-white/10 backdrop-blur-md">
                  <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-neon-purple" />
                </div>
              </div>
              
              {/* Main stats in single row with dividers */}
              <div className="grid grid-cols-3 gap-2 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                {/* Income */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-2">
                    <ArrowUp className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-2xs md:text-xs font-medium text-white/70">Income</p>
                  <p className="text-xs md:text-sm font-semibold text-green-400">
                    {formatCurrency(stats.totalIncome)}
                  </p>
                </div>
                
                {/* Expenses */}
                <div className="flex flex-col items-center relative">
                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-white/0 via-white/10 to-white/0"></div>
                  <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-white/0 via-white/10 to-white/0"></div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-2">
                    <ArrowDown className="h-4 w-4 text-red-400" />
                  </div>
                  <p className="text-2xs md:text-xs font-medium text-white/70">Expenses</p>
                  <p className="text-xs md:text-sm font-semibold text-red-400">
                    {formatCurrency(stats.totalExpenses)}
                  </p>
                </div>
                
                {/* Savings */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-2">
                    <PiggyBank className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-2xs md:text-xs font-medium text-white/70">Savings</p>
                  <p className="text-xs md:text-sm font-semibold text-blue-400">
                    {formatCurrency(stats.totalSavings)}
                  </p>
                </div>
              </div>
              
              {/* Card footer */}
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <Wallet className="h-3.5 w-3.5 text-white/50 mr-1.5" />
                  <span className="text-2xs text-white/50">FinTrack</span>
                </div>
                <p className="text-2xs font-medium text-white/50">**** **** **** 4289</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
      
      {/* Chart Section */}
      <motion.div
        initial={slideUp.initial}
        animate={slideUp.animate}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-card neon-border overflow-hidden border-0 shadow-xl">
          <CardContent className="p-3 md:p-4">
            <ExpenseChart transactions={transactions} />
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Recent Transactions Section */}
      <motion.div 
        className="space-y-2"
        initial={slideUp.initial}
        animate={slideUp.animate}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-sm md:text-base font-medium text-white px-1">Recent Transactions</h2>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
