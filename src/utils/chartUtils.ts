
import { format, parseISO } from 'date-fns';
import { Transaction } from '@/context/TransactionContext';

export interface ChartDataItem {
  name: string;
  value: number;
  count: number;
  color?: string;
}

export interface ComparisonChartDataItem {
  name: string;
  expenses: number;
  income: number;
  savings: number;
  expenseCount: number;
  incomeCount: number;
  savingsCount: number;
}

export type ChartDataType = ChartDataItem[] | ComparisonChartDataItem[];

// Function to prepare chart data based on filters
export const prepareChartData = (
  transactions: Transaction[],
  dataType: 'expenses' | 'income' | 'savings',
  comparisonType: 'none' | 'month' | 'year' | 'combined',
  yearFilter: string
): ChartDataType => {
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
    interface CategoryData {
      amount: number;
      count: number;
    }
    
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
};

// Calculate the total amount for the displayed data
export const calculateTotalAmount = (
  chartData: ChartDataType,
  dataType: 'expenses' | 'income' | 'savings'
): number => {
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
};

// Format Y-axis ticks for charts
export const formatYAxisTick = (value: number): string => {
  if (value >= 1000) {
    return `रु${(value / 1000).toFixed(1)}k`;
  }
  return `रु${value}`;
};

// Get available years from transactions
export const getAvailableYears = (transactions: Transaction[]): string[] => {
  const years = new Set<string>();
  transactions.forEach(t => {
    const year = format(parseISO(t.date), 'yyyy');
    years.add(year);
  });
  return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
};
