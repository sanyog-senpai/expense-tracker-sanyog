
import React, { useState } from 'react';
import { Transaction } from '@/context/TransactionContext';
import TransactionItem from './TransactionItem';
import { groupTransactionsByDate } from '@/utils/dateUtils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FilterX, PiggyBank } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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
      <div className="flex flex-col items-center justify-center h-[300px] glass-card neon-border rounded-xl p-8 text-center">
        <p className="text-white/70 text-sm mb-2">No transactions yet</p>
        <p className="text-xs text-white/50">
          Add your first transaction to start tracking your expenses
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 focus:border-neon-purple/50 text-white placeholder:text-white/30"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <Tabs 
            value={filter} 
            onValueChange={setFilter} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 bg-white/5 p-0.5">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-white data-[state=inactive]:text-white/50"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="expense"
                className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-white data-[state=inactive]:text-white/50"
              >
                Expense
              </TabsTrigger>
              <TabsTrigger 
                value="income"
                className="data-[state=active]:bg-neon-purple/20 data-[state=active]:text-white data-[state=inactive]:text-white/50"
              >
                Income
              </TabsTrigger>
              <TabsTrigger 
                value="savings"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=inactive]:text-white/50"
              >
                <PiggyBank className="h-3.5 w-3.5 mr-1" />
                Savings
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-purple-dark border-white/10">
              <SelectItem value="all" className="text-white">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-white">
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
              className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10"
            >
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] glass-card neon-border rounded-xl">
          <p className="text-white/70 text-sm">No transactions match your filters</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupDates.map((date) => (
            <div key={date} className="space-y-2">
              <h3 className="text-sm font-medium text-white/70 px-1">{date}</h3>
              <div className="space-y-2">
                {groupedTransactions[date].map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onEditClick={onEditTransaction}
                    onDeleteClick={onDeleteTransaction}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
