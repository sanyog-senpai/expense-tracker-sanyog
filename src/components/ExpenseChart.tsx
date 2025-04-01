
import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ComposedChart, Line } from 'recharts';
import { Transaction } from '@/context/TransactionContext';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChartIcon, CalendarIcon, CalculatorIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn, scaleIn } from '@/lib/animations';
import { formatCurrency, formatTime, getCategoryIcon } from '@/utils/dateUtils';
import { format, parseISO } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card } from '@/components/ui/card';

interface ExpenseChartProps {
  transactions: Transaction[];
}

// Define types for our chart data
interface ChartDataItem {
  name: string;
  value: number;
  count: number;
  color?: string;
}

interface ComparisonChartDataItem {
  name: string;
  expenses: number;
  income: number;
  savings: number;
  expenseCount: number;
  incomeCount: number;
  savingsCount: number;
}

type ChartDataType = ChartDataItem[] | ComparisonChartDataItem[];

// Type for category grouping
interface CategoryData {
  amount: number;
  count: number;
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
    let filteredTransactions: Transaction[];
    
    if (dataType === 'expenses') {
      filteredTransactions = transactions.filter(t => t.isExpense && !t.isSavings);
    } else if (dataType === 'income') {
      filteredTransactions = transactions.filter(t => !t.isExpense);
    } else { // savings
      filteredTransactions = transactions.filter(t => t.isSavings);
    }
    
    // If we're not doing comparison, process data by category
    if (comparisonType === 'none') {
      const groupedByCategory: Record<string, CategoryData> = filteredTransactions.reduce((acc: Record<string, CategoryData>, transaction) => {
        const { category, amount } = transaction;
        if (!acc[category]) {
          acc[category] = { amount: 0, count: 0 };
        }
        acc[category].amount += amount;
        acc[category].count += 1;
        return acc;
      }, {});
      
      return Object.entries(groupedByCategory).map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: data.amount,
        count: data.count
      })) as ChartDataItem[];
    }
    
    // For comparisons, we need to group data differently
    if (comparisonType === 'month') {
      // Group by month for the selected year
      const groupedByMonth: Record<string, { 
        expenses: number, 
        income: number, 
        savings: number,
        expenseCount: number,
        incomeCount: number,
        savingsCount: number 
      }> = {};
      
      // Initialize all months
      for (let i = 0; i < 12; i++) {
        const monthName = format(new Date(parseInt(yearFilter), i, 1), 'MMM');
        groupedByMonth[monthName] = { 
          expenses: 0, 
          income: 0, 
          savings: 0,
          expenseCount: 0,
          incomeCount: 0,
          savingsCount: 0
        };
      }
      
      // Fill with actual data
      transactions.forEach(t => {
        const date = parseISO(t.date);
        const year = format(date, 'yyyy');
        
        if (year === yearFilter) {
          const month = format(date, 'MMM');
          
          if (t.isExpense && !t.isSavings) {
            groupedByMonth[month].expenses += t.amount;
            groupedByMonth[month].expenseCount += 1;
          } else if (!t.isExpense) {
            groupedByMonth[month].income += t.amount;
            groupedByMonth[month].incomeCount += 1;
          } else if (t.isSavings) {
            groupedByMonth[month].savings += t.amount;
            groupedByMonth[month].savingsCount += 1;
          }
        }
      });
      
      // Convert to array for recharts
      return Object.entries(groupedByMonth).map(([month, data]) => ({
        name: month,
        expenses: data.expenses,
        income: data.income,
        savings: data.savings,
        expenseCount: data.expenseCount,
        incomeCount: data.incomeCount,
        savingsCount: data.savingsCount
      })) as ComparisonChartDataItem[];
    }
    
    if (comparisonType === 'year') {
      // Group by year
      const groupedByYear: Record<string, { 
        expenses: number, 
        income: number, 
        savings: number,
        expenseCount: number,
        incomeCount: number,
        savingsCount: number
      }> = {};
      
      transactions.forEach(t => {
        const year = format(parseISO(t.date), 'yyyy');
        
        if (!groupedByYear[year]) {
          groupedByYear[year] = { 
            expenses: 0, 
            income: 0, 
            savings: 0,
            expenseCount: 0,
            incomeCount: 0,
            savingsCount: 0
          };
        }
        
        if (t.isExpense && !t.isSavings) {
          groupedByYear[year].expenses += t.amount;
          groupedByYear[year].expenseCount += 1;
        } else if (!t.isExpense) {
          groupedByYear[year].income += t.amount;
          groupedByYear[year].incomeCount += 1;
        } else if (t.isSavings) {
          groupedByYear[year].savings += t.amount;
          groupedByYear[year].savingsCount += 1;
        }
      });
      
      // Convert to array for recharts
      return Object.entries(groupedByYear).map(([year, data]) => ({
        name: year,
        expenses: data.expenses,
        income: data.income,
        savings: data.savings,
        expenseCount: data.expenseCount,
        incomeCount: data.incomeCount,
        savingsCount: data.savingsCount
      })).sort((a, b) => parseInt(a.name) - parseInt(b.name)) as ComparisonChartDataItem[]; // Sort by year ascending
    }
    
    if (comparisonType === 'combined') {
      // Group by transaction type and sum up the total
      const expenseTransactions = transactions.filter(t => t.isExpense && !t.isSavings);
      const incomeTransactions = transactions.filter(t => !t.isExpense);
      const savingsTransactions = transactions.filter(t => t.isSavings);
      
      const totals = {
        expenses: expenseTransactions.reduce((sum, t) => sum + t.amount, 0),
        income: incomeTransactions.reduce((sum, t) => sum + t.amount, 0),
        savings: savingsTransactions.reduce((sum, t) => sum + t.amount, 0),
        expenseCount: expenseTransactions.length,
        incomeCount: incomeTransactions.length,
        savingsCount: savingsTransactions.length
      };
      
      return [
        { 
          name: 'Expenses', 
          value: totals.expenses, 
          count: totals.expenseCount,
          color: '#ff6b8b' 
        },
        { 
          name: 'Income', 
          value: totals.income, 
          count: totals.incomeCount,
          color: '#6bffb8' 
        },
        { 
          name: 'Savings', 
          value: totals.savings, 
          count: totals.savingsCount,
          color: '#5271ff' 
        }
      ] as ChartDataItem[];
    }
    
    return [] as ChartDataItem[];
  }, [transactions, dataType, comparisonType, yearFilter]);

  // Calculate total for the selected data
  const totalAmount = useMemo(() => {
    if (Array.isArray(chartData) && chartData.length > 0) {
      if ('value' in chartData[0]) {
        // Single category data (pie chart or combined view)
        return (chartData as ChartDataItem[]).reduce((sum, item) => sum + item.value, 0);
      } else if ('expenses' in chartData[0]) {
        // Comparison data (monthly/yearly)
        const data = chartData as ComparisonChartDataItem[];
        
        // Sum based on the selected data type
        if (dataType === 'expenses') {
          return data.reduce((sum, item) => sum + item.expenses, 0);
        } else if (dataType === 'income') {
          return data.reduce((sum, item) => sum + item.income, 0);
        } else { // savings
          return data.reduce((sum, item) => sum + item.savings, 0);
        }
      }
    }
    return 0;
  }, [chartData, dataType]);
  
  // Enhanced color palette - more vibrant and distinguishable
  const COLORS = ['#8b5cf6', '#ec4899', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
  
  const renderTooltipContent = (props: any) => {
    if (props.payload && props.payload.length > 0) {
      const payload = props.payload;
      const { name } = payload[0].payload;
      
      return (
        <div className="bg-purple-dark/95 border border-neon-purple/30 rounded-lg shadow-lg p-2.5 max-w-[200px]">
          <p className="text-white font-medium text-xs mb-1.5">{name}</p>
          {payload.map((entry: any, index: number) => {
            // Skip the 'name' field which isn't a data point
            if (entry.dataKey === 'name') return null;
            
            // Display count for transaction bars if available
            const count = entry.payload[`${entry.dataKey}Count`] || 
                          entry.payload.count;
            
            const isCountField = entry.dataKey.includes('Count');
            if (isCountField) return null;
            
            return (
              <div 
                key={`item-${index}`}
                className="flex justify-between items-center my-1"
              >
                <span className="text-2xs text-white/80">{entry.name}:</span>
                <span className="text-xs font-semibold" style={{ color: entry.color }}>
                  {entry.dataKey.includes('Count') ? 
                    `${entry.value}` : 
                    `रु ${entry.value.toLocaleString()}`}
                </span>
                {count && !entry.dataKey.includes('Count') && (
                  <span className="block text-2xs text-white/60 mt-0.5">
                    {count} transaction{count !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
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
  
  const showComparisonSelector = chartType === 'bar';
  
  // Get correct currency symbol
  const getCurrencySymbol = () => "रु";
  
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
          className="flex items-center space-x-1 md:space-x-2 bg-white/5 rounded-full px-2 py-1.5 border border-white/10"
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
      
      <div className="p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10">
        <Tabs 
          value={dataType} 
          onValueChange={(value) => setDataType(value as any)}
          className="w-full mb-4"
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
          <div className="flex items-center space-x-2 mb-4">
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
        
        {/* Total amount card */}
        <Card className="mb-4 p-3 bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalculatorIcon className="h-4 w-4 mr-2 text-neon-purple" />
              <span className="text-xs md:text-sm text-white/80">
                Total {dataType.charAt(0).toUpperCase() + dataType.slice(1)}
                {comparisonType !== 'none' ? (
                  comparisonType === 'month' 
                    ? ` (${yearFilter})` 
                    : comparisonType === 'year' 
                      ? ' (All Years)' 
                      : ' (Combined)'
                ) : ''}:
              </span>
            </div>
            <span className="text-sm md:text-base font-semibold text-white">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </Card>
        
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
                  data={chartData as ChartDataItem[]}
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
                  {(chartData as ChartDataItem[]).map((entry, index) => (
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
              <BarChart data={chartData as ChartDataItem[]} barGap={8}>
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
                      return `रु${(value / 1000).toFixed(1)}k`;
                    }
                    return `रु${value}`;
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
                  name="Amount"
                >
                  {(chartData as ChartDataItem[]).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      className="filter drop-shadow-lg"
                    />
                  ))}
                </Bar>
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                  fill="rgba(255, 255, 255, 0.3)"
                  name="Transactions"
                  barSize={10}
                />
              </BarChart>
            ) : comparisonType === 'combined' ? (
              <BarChart data={chartData as ChartDataItem[]} barGap={8}>
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
                      return `रु${(value / 1000).toFixed(1)}k`;
                    }
                    return `रु${value}`;
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
                  name="Amount"
                >
                  {(chartData as ChartDataItem[]).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color || COLORS[index % COLORS.length]} 
                      className="filter drop-shadow-lg"
                    />
                  ))}
                </Bar>
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                  fill="rgba(255, 255, 255, 0.3)"
                  name="Transactions"
                  barSize={10}
                />
              </BarChart>
            ) : (
              <ComposedChart data={chartData as ComparisonChartDataItem[]} barGap={8}>
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
                      return `रु${(value / 1000).toFixed(1)}k`;
                    }
                    return `रु${value}`;
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
                {/* Transaction count bars - slightly altered for clarity */}
                <Bar 
                  dataKey="expenseCount" 
                  fill="rgba(255, 107, 139, 0.3)" 
                  name="Expense Transactions"
                  radius={[4, 4, 0, 0]}
                  barSize={8}
                />
                <Bar 
                  dataKey="incomeCount" 
                  fill="rgba(107, 255, 184, 0.3)" 
                  name="Income Transactions"
                  radius={[4, 4, 0, 0]}
                  barSize={8}
                />
                <Bar 
                  dataKey="savingsCount" 
                  fill="rgba(82, 113, 255, 0.3)" 
                  name="Savings Transactions"
                  radius={[4, 4, 0, 0]}
                  barSize={8}
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ExpenseChart;
