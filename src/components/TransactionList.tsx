
import React, { useState } from 'react';
import { Transaction } from '@/context/TransactionContext';
import TransactionItem from './TransactionItem';
import { groupTransactionsByDate } from '@/utils/dateUtils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FilterX, PiggyBank, ArrowDown, ArrowUp, ListFilter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { fadeIn, staggerChildren } from '@/lib/animations';

interface TransactionListProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onEditTransaction, 
  onDeleteTransaction 
}) => {
  const [filter, setFilter] = useState('all'); // 'all', 'expense', 'income', 'savings'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const isMobile = useIsMobile();
  
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (filter === 'expense' && !transaction.isExpense) return false;
    if (filter === 'income' && transaction.isExpense) return false;
    if (filter === 'savings' && !transaction.isSavings) return false;
    
    // Filter by category
    if (categoryFilter !== 'all' && transaction.category !== categoryFilter) return false;
    
    // Filter by search term
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const groupedTransactions = groupTransactionsByDate(filteredTransactions);
  const groupDates = Object.keys(groupedTransactions);
  
  const categories = Array.from(new Set(transactions.map(t => t.category)));
  
  const clearFilters = () => {
    setFilter('all');
    setSearchTerm('');
    setCategoryFilter('all');
  };
  
  const hasActiveFilters = filter !== 'all' || searchTerm || categoryFilter !== 'all';
  
  if (transactions.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-[300px] glass-card neon-border rounded-xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-white/70 text-sm mb-2">No transactions yet</p>
        <p className="text-xs text-white/50">
          Add your first transaction to start tracking your expenses
        </p>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="space-y-4"
      initial="initial"
      animate="animate"
      variants={staggerChildren(0.1)}
    >
      <motion.div 
        className="flex flex-col space-y-3"
        variants={fadeIn}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 focus:border-neon-purple/50 text-white placeholder:text-white/30"
          />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3">
          <Tabs 
            value={filter} 
            onValueChange={setFilter} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 bg-white/5 p-0.5 w-full">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-white data-[state=inactive]:text-white/50 py-1 md:py-1.5 text-2xs md:text-xs h-8 md:h-9"
              >
                <ListFilter className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" />
                {!isMobile && "All"}
              </TabsTrigger>
              <TabsTrigger 
                value="expense"
                className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 data-[state=inactive]:text-white/50 py-1 md:py-1.5 text-2xs md:text-xs h-8 md:h-9"
              >
                <ArrowDown className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-red-400" />
                {isMobile ? 'Exp' : 'Expense'}
              </TabsTrigger>
              <TabsTrigger 
                value="income"
                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=inactive]:text-white/50 py-1 md:py-1.5 text-2xs md:text-xs h-8 md:h-9"
              >
                <ArrowUp className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-green-400" />
                {isMobile ? 'Inc' : 'Income'}
              </TabsTrigger>
              <TabsTrigger 
                value="savings"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=inactive]:text-white/50 py-1 md:py-1.5 text-2xs md:text-xs h-8 md:h-9"
              >
                <PiggyBank className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" />
                {isMobile ? 'Sav' : 'Savings'}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center space-x-2">
            <Select 
              value={categoryFilter} 
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 md:h-9 text-2xs md:text-xs w-[110px] md:w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-purple-dark border-white/10">
                <SelectItem value="all" className="text-white text-xs">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white text-xs">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearFilters}
                className="h-8 md:h-9 w-8 md:w-9 text-white/70 hover:text-white hover:bg-white/10"
              >
                <FilterX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
      
      {filteredTransactions.length === 0 ? (
        <motion.div 
          className="flex items-center justify-center h-[200px] glass-card neon-border rounded-xl"
          variants={fadeIn}
        >
          <p className="text-white/70 text-sm">No transactions match your filters</p>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-5 md:space-y-7"
          variants={staggerChildren(0.1)}
        >
          {groupDates.map((date, groupIndex) => (
            <motion.div 
              key={date} 
              className="space-y-2.5"
              variants={fadeIn}
              transition={{ delay: groupIndex * 0.1 }}
            >
              <h3 className="text-2xs md:text-sm font-medium text-white/70 px-1">{date}</h3>
              <motion.div 
                className="space-y-2.5"
                variants={staggerChildren(0.05)}
              >
                {groupedTransactions[date].map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    variants={fadeIn}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TransactionItem
                      transaction={transaction}
                      onEditClick={onEditTransaction}
                      onDeleteClick={onDeleteTransaction}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TransactionList;
