
import React, { useState } from 'react';
import { Transaction } from '@/context/TransactionContext';
import { motion } from 'framer-motion';
import { fadeIn, scaleIn } from '@/lib/animations';
import { ChartDataType, prepareChartData, calculateTotalAmount, formatYAxisTick, getAvailableYears } from '@/utils/chartUtils';

// Import modular components
import ChartControls from './charts/ChartControls';
import TotalAmountCard from './charts/TotalAmountCard';
import PieChartComponent from './charts/PieChartComponent';
import BarChartComponent from './charts/BarChartComponent';
import ComposedChartComponent from './charts/ComposedChartComponent';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [dataType, setDataType] = useState<'expenses' | 'income' | 'savings'>('expenses');
  const [comparisonType, setComparisonType] = useState<'none' | 'month' | 'year' | 'combined'>('none');
  const [yearFilter, setYearFilter] = useState<string>(new Date().getFullYear().toString());
  
  // Get available years from transactions
  const availableYears = getAvailableYears(transactions);
  
  // Prepare chart data based on selected filters
  const chartData: ChartDataType = prepareChartData(
    transactions, 
    dataType, 
    comparisonType, 
    yearFilter
  );

  // Calculate total amount
  const totalAmount = calculateTotalAmount(chartData, dataType);
  
  // Enhanced color palette - more vibrant and distinguishable
  const COLORS = ['#8b5cf6', '#ec4899', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
  
  return (
    <motion.div 
      className="space-y-4"
      variants={fadeIn}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.3 }}
    >
      <ChartControls
        chartType={chartType}
        dataType={dataType}
        comparisonType={comparisonType}
        yearFilter={yearFilter}
        availableYears={availableYears}
        onChartTypeChange={setChartType}
        onDataTypeChange={setDataType}
        onComparisonTypeChange={setComparisonType}
        onYearFilterChange={setYearFilter}
      />
      
      <div className="p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10">
        <TotalAmountCard
          totalAmount={totalAmount}
          dataType={dataType}
          comparisonType={comparisonType}
          yearFilter={yearFilter}
        />
        
        <motion.div 
          className="w-full h-[250px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          variants={scaleIn}
        >
          {/* Render different chart types based on selected options */}
          {chartType === 'pie' && comparisonType === 'none' ? (
            <PieChartComponent 
              chartData={chartData as any} 
              COLORS={COLORS} 
            />
          ) : comparisonType === 'none' || comparisonType === 'combined' ? (
            <BarChartComponent 
              chartData={chartData as any} 
              COLORS={COLORS} 
              formatYAxisTick={formatYAxisTick} 
            />
          ) : (
            <ComposedChartComponent 
              chartData={chartData as any} 
              formatYAxisTick={formatYAxisTick} 
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ExpenseChart;
