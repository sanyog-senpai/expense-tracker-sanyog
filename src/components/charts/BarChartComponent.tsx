
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import ChartTooltip from '@/components/ChartTooltip';

interface ChartDataItem {
  name: string;
  value: number;
  count: number;
  color?: string;
}

interface BarChartComponentProps {
  chartData: ChartDataItem[];
  COLORS: string[];
  formatYAxisTick: (value: number) => string;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ 
  chartData,
  COLORS,
  formatYAxisTick
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
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
          tickFormatter={formatYAxisTick}
          domain={[0, 'dataMax + 500']}
        />
        <Tooltip content={<ChartTooltip />} />
        <Bar 
          dataKey="value" 
          radius={[4, 4, 0, 0]}
          animationBegin={0}
          animationDuration={1200}
          animationEasing="ease-out"
          name="Amount"
        >
          {chartData.map((entry, index) => (
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
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
