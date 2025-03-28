
import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction } from '@/context/TransactionContext';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CharsSquare, BarChart3, PieChartIcon } from 'lucide-react';

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
    <div className="space-y-4 fade-in">
      <div className="flex justify-between items-center">
        <Tabs 
          value={dataType} 
          onValueChange={(value) => setDataType(value as any)}
          className="w-auto"
        >
          <TabsList className="bg-white/5 p-0.5">
            <TabsTrigger 
              value="expenses" 
              className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 data-[state=inactive]:text-white/50"
            >
              Expenses
            </TabsTrigger>
            <TabsTrigger 
              value="income"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=inactive]:text-white/50"
            >
              Income
            </TabsTrigger>
            <TabsTrigger 
              value="savings"
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=inactive]:text-white/50"
            >
              Savings
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center space-x-2">
          <PieChartIcon className={`h-5 w-5 ${chartType === 'pie' ? 'text-neon-purple' : 'text-white/50'}`} />
          <Switch 
            checked={chartType === 'bar'} 
            onCheckedChange={(checked) => setChartType(checked ? 'bar' : 'pie')}
            className="data-[state=checked]:bg-neon-purple"
          />
          <BarChart3 className={`h-5 w-5 ${chartType === 'bar' ? 'text-neon-purple' : 'text-white/50'}`} />
        </div>
      </div>
      
      <div className="w-full h-[250px]">
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
                formatter={(value: string) => <span className="text-white/90 text-sm">{value}</span>}
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
      </div>
    </div>
  );
};

export default ExpenseChart;
