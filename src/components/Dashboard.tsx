
import React, { useMemo } from 'react';
import { Transaction } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      {/* Balance Card - Credit Card Style */}
      <motion.div 
        className="card-3d"
        initial={slideUp.initial}
        animate={slideUp.animate}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="card-inner-3d">
          <Card className="glass-card neon-border overflow-hidden relative h-44 md:h-48">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/20 rounded-full filter blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-neon-blue/20 rounded-full filter blur-xl"></div>
            </div>
            
            <CardContent className="p-4 md:p-6 relative h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-white/70 mb-1">Available Balance</p>
                  <div className="flex items-baseline">
                    <AnimatedNumber
                      value={stats.balance}
                      formatter={(value) => formatCurrency(value)}
                      className={`${isMobile ? "text-2xl" : "text-3xl"} font-bold text-white`}
                    />
                  </div>
                </div>
                <CreditCard className="h-7 w-7 md:h-8 md:w-8 text-neon-purple animate-pulse-subtle" />
              </div>
              
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <ArrowUp className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xs md:text-xs font-medium text-white/70">Income</p>
                      <p className="text-xs md:text-sm font-semibold text-green-400">
                        {formatCurrency(stats.totalIncome)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <ArrowDown className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-2xs md:text-xs font-medium text-white/70">Expenses</p>
                      <p className="text-xs md:text-sm font-semibold text-red-400">
                        {formatCurrency(stats.totalExpenses)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <PiggyBank className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xs md:text-xs font-medium text-white/70">Savings</p>
                      <p className="text-xs md:text-sm font-semibold text-blue-400">
                        {formatCurrency(stats.totalSavings)}
                      </p>
                    </div>
                  </div>
                  <p className="text-2xs md:text-xs font-medium text-white/50">**** **** **** 4289</p>
                </div>
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
        <Card className="glass-card neon-border">
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
