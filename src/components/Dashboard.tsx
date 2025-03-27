
import React, { useMemo } from 'react';
import { Transaction } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Wallet, CreditCard } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import ExpenseChart from './ExpenseChart';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => !t.isExpense)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = transactions
      .filter(t => t.isExpense)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = totalIncome - totalExpenses;
    
    return { totalIncome, totalExpenses, balance };
  }, [transactions]);
  
  return (
    <div className="space-y-6 mb-6">
      {/* Balance Card - Credit Card Style */}
      <div className="card-3d">
        <div className="card-inner-3d">
          <Card className="glass-card neon-border overflow-hidden relative h-48">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/20 rounded-full filter blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-neon-blue/20 rounded-full filter blur-xl"></div>
            </div>
            
            <CardContent className="p-6 relative h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-white/70 mb-1">Available Balance</p>
                  <div className="flex items-baseline">
                    <AnimatedNumber
                      value={stats.balance}
                      formatter={(value) => formatCurrency(value)}
                      className="text-3xl font-bold text-white"
                    />
                  </div>
                </div>
                <CreditCard className="h-8 w-8 text-neon-purple animate-pulse-subtle" />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <ArrowUp className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/70">Income</p>
                      <p className="text-sm font-semibold text-green-400">
                        {formatCurrency(stats.totalIncome)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <ArrowDown className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/70">Expenses</p>
                      <p className="text-sm font-semibold text-red-400">
                        {formatCurrency(stats.totalExpenses)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-xs font-medium text-white/50">**** **** **** 4289</p>
                  <p className="text-xs font-medium text-white/50">06/25</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Chart Section */}
      <Card className="glass-card neon-border">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base font-medium text-white">Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ExpenseChart transactions={transactions} />
        </CardContent>
      </Card>
      
      {/* Recent Transactions Section */}
      <div className="space-y-2">
        <h2 className="text-base font-medium text-white px-1">Recent Transactions</h2>
      </div>
    </div>
  );
};

export default Dashboard;
