
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Transaction } from '@/context/TransactionContext';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    const expensesByCategory = transactions
      .filter(t => t.isExpense)
      .reduce((acc: Record<string, number>, transaction) => {
        const { category, amount } = transaction;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
      }, {});
    
    return Object.entries(expensesByCategory).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [transactions]);
  
  // Futuristic color palette
  const COLORS = ['#a269ff', '#5271ff', '#ff56ee', '#6bffb8', '#ff6b8b', '#ffb156'];
  
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-white/5 rounded-xl">
        <p className="text-white/70 text-sm">No expense data to display</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-[250px] fade-in">
      <ResponsiveContainer width="100%" height="100%">
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
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            contentStyle={{
              backgroundColor: 'rgba(30, 25, 45, 0.9)',
              borderRadius: '12px',
              border: '1px solid rgba(162, 105, 255, 0.3)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              color: 'white',
              padding: '8px 12px'
            }}
          />
          <Legend 
            formatter={(value: string) => <span className="text-white/70">{value}</span>}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
