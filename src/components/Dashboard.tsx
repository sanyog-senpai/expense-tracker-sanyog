
import React, { useMemo } from 'react';
import { Transaction } from '@/context/TransactionContext';
import { formatCurrency } from '@/utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Wallet } from 'lucide-react';
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
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="backdrop-blur-sm bg-opacity-80 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center">
              <Wallet className="h-5 w-5 mr-2 text-primary" />
              <AnimatedNumber
                value={stats.balance}
                formatter={(value) => formatCurrency(value)}
                className="text-2xl font-semibold"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-sm bg-opacity-80 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Income</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center">
              <ArrowUp className="h-5 w-5 mr-2 text-green-500" />
              <AnimatedNumber
                value={stats.totalIncome}
                formatter={(value) => formatCurrency(value)}
                className="text-2xl font-semibold text-green-500"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-sm bg-opacity-80 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center">
              <ArrowDown className="h-5 w-5 mr-2 text-red-500" />
              <AnimatedNumber
                value={stats.totalExpenses}
                formatter={(value) => formatCurrency(value)}
                className="text-2xl font-semibold text-red-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ExpenseChart transactions={transactions} />
    </div>
  );
};

export default Dashboard;
