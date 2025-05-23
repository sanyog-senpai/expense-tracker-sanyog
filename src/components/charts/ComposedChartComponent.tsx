
import React from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartTooltip from '@/components/ChartTooltip';

interface ComparisonChartDataItem {
  name: string;
  expenses: number;
  income: number;
  savings: number;
  expenseCount: number;
  incomeCount: number;
  savingsCount: number;
}

interface ComposedChartComponentProps {
  chartData: ComparisonChartDataItem[];
  formatYAxisTick: (value: number) => string;
}

const ComposedChartComponent: React.FC<ComposedChartComponentProps> = ({ 
  chartData,
  formatYAxisTick
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
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
          tickFormatter={formatYAxisTick}
          domain={[0, 'dataMax + 500']}
        />
        <Tooltip content={<ChartTooltip />} />
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
    </ResponsiveContainer>
  );
};

export default ComposedChartComponent;
