
import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ComposedChart, Line } from 'recharts';
import { Transaction } from '@/context/TransactionContext';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChartIcon, CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn, scaleIn } from '@/lib/animations';
import { formatCurrency } from '@/utils/dateUtils';
import { format, parseISO } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [dataType, setDataType] = useState<'expenses' | 'income' | 'savings'>('expenses');
  const [comparisonType, setComparisonType] = useState<'none' | 'month' | 'year' | 'combined'>('none');
  const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());
  
  // Get available years from transactions
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    transactions.forEach(t => {
      const year = format(parseISO(t.date), 'yyyy');
      years.add(year);
    });
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [transactions]);
  
  const chartData = useMemo(() => {
    let filteredTransactions;
    
    if (dataType === 'expenses') {
      filteredTransactions = transactions.filter(t => t.isExpense && !t.isSavings);
    } else if (dataType === 'income') {
      filteredTransactions = transactions.filter(t => !t.isExpense);
    } else { // savings
      filteredTransactions = transactions.filter(t => t.isSavings);
    }
    
    // If we're not doing comparison, process data by category
    if (comparisonType === 'none') {
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
    }
    
    // For comparisons, we need to group data differently
    if (comparisonType === 'month') {
      // Group by month for the selected year
      const groupedByMonth: Record<string, { expenses: number, income: number, savings: number }> = {};
      
      // Initialize all months
      for (let i = 0; i < 12; i++) {
        const monthName = format(new Date(parseInt(yearFilter), i, 1), 'MMM');
        groupedByMonth[monthName] = { expenses: 0, income: 0, savings: 0 };
      }
      
      // Fill with actual data
      transactions.forEach(t => {
        const date = parseISO(t.date);
        const year = format(date, 'yyyy');
        
        if (year === yearFilter) {
          const month = format(date, 'MMM');
          
          if (t.isExpense && !t.isSavings) {
            groupedByMonth[month].expenses += t.amount;
          } else if (!t.isExpense) {
            groupedByMonth[month].income += t.amount;
          } else if (t.isSavings) {
            groupedByMonth[month].savings += t.amount;
          }
        }
      });
      
      // Convert to array for recharts
      return Object.entries(groupedByMonth).map(([month, data]) => ({
        name: month,
        expenses: data.expenses,
        income: data.income,
        savings: data.savings
      }));
    }
    
    if (comparisonType === 'year') {
      // Group by year
      const groupedByYear: Record<string, { expenses: number, income: number, savings: number }> = {};
      
      transactions.forEach(t => {
        const year = format(parseISO(t.date), 'yyyy');
        
        if (!groupedByYear[year]) {
          groupedByYear[year] = { expenses: 0, income: 0, savings: 0 };
        }
        
        if (t.isExpense && !t.isSavings) {
          groupedByYear[year].expenses += t.amount;
        } else if (!t.isExpense) {
          groupedByYear[year].income += t.amount;
        } else if (t.isSavings) {
          groupedByYear[year].savings += t.amount;
        }
      });
      
      // Convert to array for recharts
      return Object.entries(groupedByYear).map(([year, data]) => ({
        name: year,
        expenses: data.expenses,
        income: data.income,
        savings: data.savings
      })).sort((a, b) => parseInt(a.name) - parseInt(b.name)); // Sort by year ascending
    }
    
    if (comparisonType === 'combined') {
      // Group by transaction type and sum up the total
      const totals = {
        expenses: transactions.filter(t => t.isExpense && !t.isSavings).reduce((sum, t) => sum + t.amount, 0),
        income: transactions.filter(t => !t.isExpense).reduce((sum, t) => sum + t.amount, 0),
        savings: transactions.filter(t => t.isSavings).reduce((sum, t) => sum + t.amount, 0)
      };
      
      return [
        { name: 'Expenses', value: totals.expenses, color: '#ff6b8b' },
        { name: 'Income', value: totals.income, color: '#6bffb8' },
        { name: 'Savings', value: totals.savings, color: '#5271ff' }
      ];
    }
    
    return [];
  }, [transactions, dataType, comparisonType, yearFilter]);
  
  // Futuristic color palette
  const COLORS = ['#a269ff', '#5271ff', '#ff56ee', '#6bffb8', '#ff6b8b', '#ffb156'];
  
  const renderTooltipContent = (props: any) => {
    if (props.payload && props.payload.length > 0) {
      const { name } = props.payload[0].payload;
      
      return (
        <div className="bg-purple-dark/95 border border-neon-purple/30 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium text-sm">{name}</p>
          {props.payload.map((entry: any, index: number) => {
            // Skip the 'name' field which isn't a data point
            if (entry.dataKey === 'name') return null;
            
            return (
              <p 
                key={`item-${index}`}
                className="text-white font-bold text-base"
                style={{ color: entry.color }}
              >
                {entry.name}: {formatCurrency(entry.value)}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };
  
  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-white/5 rounded-xl">
        <p className="text-white/70 text-sm">No data to display</p>
      </div>
    );
  }
  
  const showComparisonSelector = dataType !== '' && chartType === 'bar';
  
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
        
        <motion.div 
          className="flex items-center space-x-1 md:space-x-2 bg-white/5 rounded-full px-2 py-1 border border-white/10"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <PieChartIcon className={`h-4 w-4 md:h-5 md:w-5 ${chartType === 'pie' ? 'text-neon-purple' : 'text-white/50'}`} />
          <Switch 
            checked={chartType === 'bar'} 
            onCheckedChange={(checked) => {
              setChartType(checked ? 'bar' : 'pie');
              if (!checked) {
                setComparisonType('none');
              }
            }}
            className="data-[state=checked]:bg-neon-purple"
          />
          <BarChart3 className={`h-4 w-4 md:h-5 md:w-5 ${chartType === 'bar' ? 'text-neon-purple' : 'text-white/50'}`} />
        </motion.div>
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
      
      {showComparisonSelector && (
        <div className="flex items-center space-x-2">
          <Select
            value={comparisonType}
            onValueChange={(value: any) => setComparisonType(value)}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 text-xs w-full">
              <div className="flex items-center">
                <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-white/70" />
                <SelectValue placeholder="Compare by">
                  {comparisonType === 'none' ? 'No Comparison' : 
                   comparisonType === 'month' ? 'Monthly Comparison' : 
                   comparisonType === 'year' ? 'Yearly Comparison' : 
                   'Combined View'}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-purple-dark border-white/10">
              <SelectItem value="none" className="text-white text-xs">No Comparison</SelectItem>
              <SelectItem value="month" className="text-white text-xs">Monthly Comparison</SelectItem>
              <SelectItem value="year" className="text-white text-xs">Yearly Comparison</SelectItem>
              <SelectItem value="combined" className="text-white text-xs">Combined View</SelectItem>
            </SelectContent>
          </Select>
          
          {comparisonType === 'month' && (
            <Select
              value={yearFilter}
              onValueChange={setYearFilter}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 text-xs w-24">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-purple-dark border-white/10">
                {availableYears.map(year => (
                  <SelectItem key={year} value={year} className="text-white text-xs">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
      
      <motion.div 
        className="w-full h-[250px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        variants={scaleIn}
      >
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' && comparisonType === 'none' ? (
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
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
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
          ) : comparisonType === 'none' ? (
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
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `रू${(value / 1000).toFixed(1)}k`;
                  }
                  return `रू${value}`;
                }}
                domain={[0, 'dataMax + 500']}
              />
              <Tooltip content={renderTooltipContent} />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
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
          ) : comparisonType === 'combined' ? (
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
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `रू${(value / 1000).toFixed(1)}k`;
                  }
                  return `रू${value}`;
                }}
                domain={[0, 'dataMax + 500']}
              />
              <Tooltip content={renderTooltipContent} />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || COLORS[index % COLORS.length]} 
                    className="filter drop-shadow-lg"
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <ComposedChart data={chartData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
              />
              <YAxis 
                tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `रू${(value / 1000).toFixed(1)}k`;
                  }
                  return `रू${value}`;
                }}
                domain={[0, 'dataMax + 500']}
              />
              <Tooltip content={renderTooltipContent} />
              <Bar 
                dataKey="expenses" 
                fill="#ff6b8b" 
                name="Expenses"
                radius={[4, 4, 0, 0]}
                stackId="a"
              />
              <Bar 
                dataKey="income" 
                fill="#6bffb8" 
                name="Income"
                radius={[4, 4, 0, 0]}
                stackId="b"
              />
              <Bar 
                dataKey="savings" 
                fill="#5271ff" 
                name="Savings"
                radius={[4, 4, 0, 0]}
                stackId="c"
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default ExpenseChart;
