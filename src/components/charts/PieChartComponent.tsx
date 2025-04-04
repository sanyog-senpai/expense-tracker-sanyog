
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ChartTooltip from '@/components/ChartTooltip';

interface ChartDataItem {
  name: string;
  value: number;
  count: number;
  color?: string;
}

interface PieChartComponentProps {
  chartData: ChartDataItem[];
  COLORS: string[];
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ chartData, COLORS }) => {
  return (
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
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend 
          formatter={(value: string) => <span className="text-white/90 text-xs md:text-sm">{value}</span>}
          iconType="circle"
          iconSize={10}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
