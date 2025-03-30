
import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction } from '@/context/TransactionContext';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChartIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [dataType, setDataType] = useState<'expenses' | 'income' | 'savings'>('expenses');
  
  const chartData = useMemo(() => {
    let filteredTransactions;
    
    if (dataType === 'expenses') {
      filteredTransactions = transactions.filter(t => t.isExpense && !t.isSavings);
    } else if (dataType === 'income') {
      filteredTransactions = transactions.filter(t => !t.isExpense);
    } else { // savings
      filteredTransactions = transactions.filter(t => t.isSavings);
    }
    
    const groupedByCategory = filteredTransactions.reduce((acc: Record<string, number>, transaction) => {
      const { category, amount } = transaction;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += amount;
      return acc;
    }, {});
    
    return Object.entries(groupedByCategory).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [transactions, dataType]);
  
  // Futuristic color palette
  const COLORS = ['#a269ff', '#5271ff', '#ff56ee', '#6bffb8', '#ff6b8b', '#ffb156'];
  
  const renderTooltipContent = (props: any) => {
    if (props.payload && props.payload.length > 0) {
      const { name, value } = props.payload[0].payload;
      return (
        <div className="bg-purple-dark/95 border border-neon-purple/30 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium text-sm">{name}</p>
          <p className="text-white font-bold text-base">
            NPR {value.toLocaleString('en-NP')}
          </p>
        </div>
      );
    }
    return null;
  };
  
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-white/5 rounded-xl">
        <p className="text-white/70 text-sm">No {dataType} data to display</p>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="space-y-4"
      variants={fadeIn}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm md:text-base font-medium text-white">Financial Summary</h3>
        
        <div className="flex items-center space-x-1 md:space-x-2">
          <PieChartIcon className={`h-4 w-4 md:h-5 md:w-5 ${chartType === 'pie' ? 'text-neon-purple' : 'text-white/50'}`} />
          <Switch 
            checked={chartType === 'bar'} 
            onCheckedChange={(checked) => setChartType(checked ? 'bar' : 'pie')}
            className="data-[state=checked]:bg-neon-purple h-4 md:h-5 w-7 md:w-9"
          />
          <BarChart3 className={`h-4 w-4 md:h-5 md:w-5 ${chartType === 'bar' ? 'text-neon-purple' : 'text-white/50'}`} />
        </div>
      </div>
      
      <Tabs 
        value={dataType} 
        onValueChange={(value) => setDataType(value as any)}
        className="w-full"
      >
        <TabsList className="bg-white/5 p-0.5 w-full grid grid-cols-3">
          <TabsTrigger 
            value="expenses" 
            className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 data-[state=inactive]:text-white/50 text-2xs md:text-xs h-7 md:h-8"
          >
            Expenses
          </TabsTrigger>
          <TabsTrigger 
            value="income"
            className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=inactive]:text-white/50 text-2xs md:text-xs h-7 md:h-8"
          >
            Income
          </TabsTrigger>
          <TabsTrigger 
            value="savings"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=inactive]:text-white/50 text-2xs md:text-xs h-7 md:h-8"
          >
            Savings
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <motion.div 
        className="w-full h-[250px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                strokeWidth={2}
                stroke="rgba(255, 255, 255, 0.1)"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    className="filter drop-shadow-lg"
                  />
                ))}
              </Pie>
              <Tooltip content={renderTooltipContent} />
              <Legend 
                formatter={(value: string) => <span className="text-white/90 text-xs md:text-sm">{value}</span>}
                iconType="circle"
                iconSize={10}
              />
            </PieChart>
          ) : (
            <BarChart data={chartData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
              />
              <YAxis 
                tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                tickFormatter={(value) => `NPR ${value / 1000}k`}
              />
              <Tooltip content={renderTooltipContent} />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    className="filter drop-shadow-lg"
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default ExpenseChart;
