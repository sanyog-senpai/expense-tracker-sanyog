
import React, { useMemo } from 'react';
import { Transaction } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/dateUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, CreditCard, TrendingUp, ArrowDown, ArrowUp, PiggyBank } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import ExpenseChart from './ExpenseChart';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { cardVariants, fadeInUp } from '@/lib/pageTransitions';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

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

  const handleCardClick = () => {
    navigate('/financial-details');
  };

  return (
    <motion.div
      className="space-y-5 mb-6"
      initial="initial"
      animate="animate"
      variants={cardVariants}
    >
      {/* Main Financial Card */}
      <motion.div
        className="card-3d"
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={handleCardClick}
      >
        <div className="card-inner-3d">
          <Card className="relative h-auto overflow-hidden border-3 border-neon-purple/60 shadow-2xl shadow-purple-700/20 bg-gradient-to-br from-purple-dark/90 to-black/80 hover:shadow-purple-700/30 hover:border-neon-purple/80 transition-all duration-300 cursor-pointer">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <motion.div
                className="absolute -top-10 -right-10 w-40 h-40 bg-neon-purple/30 rounded-full filter blur-xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.4, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-neon-blue/30 rounded-full filter blur-xl"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-20 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 rotate-45 filter blur-xl"></div>
            </div>

            <CardContent className="p-5 md:p-6 relative">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <motion.h2
                    className="text-xs font-medium text-white/70 mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Available Balance
                  </motion.h2>
                  <div className="flex items-baseline">
                    <AnimatedNumber
                      value={stats.balance}
                      formatter={(value) => formatCurrency(value)}
                      className={`${isMobile ? "text-2xl" : "text-3xl"} font-bold text-white`}
                      duration={800}
                    />
                  </div>
                </div>
                <motion.button
                  className="p-2.5 rounded-full bg-gradient-to-br from-neon-purple/30 to-neon-blue/20 backdrop-blur-md border border-white/10 shadow-lg"
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 20px rgba(162, 105, 255, 0.5)",
                    background: "linear-gradient(to bottom right, rgba(162, 105, 255, 0.5), rgba(82, 113, 255, 0.4))"
                  }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="View financial details"
                >
                  <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </motion.button>
              </div>

              {/* Financial Summary Cards */}
              <div className="grid grid-cols-3 gap-2 mt-4 mb-3">
                <motion.div
                  className="bg-green-500/20 backdrop-blur-sm rounded-lg p-2 border border-green-500/30"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                >
                  <div className="flex items-center mb-1">
                    <ArrowUp className="w-3 h-3 text-green-400 mr-1" />
                    <span className="text-2xs text-white/80">Income</span>
                  </div>
                  <p className="text-xs font-semibold text-green-400">{formatCurrency(stats.totalIncome)}</p>
                </motion.div>

                <motion.div
                  className="bg-red-500/20 backdrop-blur-sm rounded-lg p-2 border border-red-500/30"
                  variants={fadeInUp}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                >
                  <div className="flex items-center mb-1">
                    <ArrowDown className="w-3 h-3 text-red-400 mr-1" />
                    <span className="text-2xs text-white/80">Expense</span>
                  </div>
                  <p className="text-xs font-semibold text-red-400">{formatCurrency(stats.totalExpenses)}</p>
                </motion.div>

                <motion.div
                  className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-2 border border-blue-500/30"
                  variants={fadeInUp}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                >
                  <div className="flex items-center mb-1">
                    <PiggyBank className="w-3 h-3 text-blue-400 mr-1" />
                    <span className="text-2xs text-white/80">Savings</span>
                  </div>
                  <p className="text-xs font-semibold text-blue-400">{formatCurrency(stats.totalSavings)}</p>
                </motion.div>
              </div>

              {/* Card footer */}
              <div className="mt-2 flex justify-between items-center">
                <div className="flex items-center">
                  <Wallet className="h-3.5 w-3.5 text-white/50 mr-1.5" />
                  <span className="text-2xs text-white/50">FinTrack</span>
                </div>
                <motion.p
                  className="text-2xs font-medium text-white/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  **** **** **** 4289
                </motion.p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Chart Section */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <Card className="overflow-hidden border-3 border-neon-blue/50 shadow-xl shadow-blue-700/20 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] hover:shadow-blue-700/30 hover:border-neon-blue/70 transition-all duration-300">
          <CardContent className="p-3 md:p-4">
            <ExpenseChart transactions={transactions} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Transactions Section */}
      {/* <motion.div
        className="space-y-2"
        variants={fadeInUp}>
        <h2 className="text-sm md:text-base font-medium text-white px-1">Recent Transactions</h2>
      </motion.div> */}
    </motion.div>
  );
};

export default Dashboard;
