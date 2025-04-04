
import React from 'react';
import { PieChartIcon, BarChart3, CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

interface ChartControlsProps {
  chartType: 'pie' | 'bar';
  dataType: 'expenses' | 'income' | 'savings';
  comparisonType: 'none' | 'month' | 'year' | 'combined';
  yearFilter: string;
  availableYears: string[];
  onChartTypeChange: (type: 'pie' | 'bar') => void;
  onDataTypeChange: (type: 'expenses' | 'income' | 'savings') => void;
  onComparisonTypeChange: (type: 'none' | 'month' | 'year' | 'combined') => void;
  onYearFilterChange: (year: string) => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  chartType,
  dataType,
  comparisonType,
  yearFilter,
  availableYears,
  onChartTypeChange,
  onDataTypeChange,
  onComparisonTypeChange,
  onYearFilterChange,
}) => {
  const showComparisonSelector = chartType === 'bar';

  return (
    <>
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
              onChartTypeChange(checked ? 'bar' : 'pie');
              if (!checked) {
                onComparisonTypeChange('none');
              }
            }}
            className="data-[state=checked]:bg-neon-purple"
          />
          <BarChart3 className={`h-4 w-4 md:h-5 md:w-5 ${chartType === 'bar' ? 'text-neon-purple' : 'text-white/50'}`} />
        </motion.div>
      </div>
      
      <Tabs 
        value={dataType} 
        onValueChange={(value) => onDataTypeChange(value as any)}
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
            onValueChange={(value: any) => onComparisonTypeChange(value)}
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
              onValueChange={onYearFilterChange}
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
    </>
  );
};

export default ChartControls;
