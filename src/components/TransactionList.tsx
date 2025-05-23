import React, { useState, useMemo } from 'react';
import { useTransactions, Transaction } from '@/context/TransactionContext'; // Corrected hook name

import TransactionItem from './TransactionItem';
import { groupTransactionsByDate, formatCurrency } from '@/utils/dateUtils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search, FilterX, PiggyBank, ArrowDown, ArrowUp, ListFilter,
  Calendar, Download, FileDown, FileSpreadsheet, CalculatorIcon,
  Grid, Plus
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { fadeIn, staggerChildren, slideUp } from '@/lib/animations';
import { exportTransactionsToExcel } from '@/utils/exportUtils';
import { useNavigate, Link } from 'react-router-dom';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TransactionListProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

const MONTHS = [
  'All', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getCurrentYear = () => new Date().getFullYear();
const getYearOptions = () => {
  const currentYear = getCurrentYear();
  const years = ['All'];

  // Add years from current year to 2035
  for (let year = currentYear; year <= 2035; year++) {
    years.push(year.toString());
  }

  // Add past years
  for (let year = currentYear - 1; year >= currentYear - 5; year--) {
    years.push(year.toString());
  }

  // Sort years in descending order (newest first), but keep 'All' at the front
  return [
    'All',
    ...years.filter(y => y !== 'All').sort((a, b) => Number(b) - Number(a))
  ];
};

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const [filter, setFilter] = useState('all'); // 'all', 'expense', 'income', 'savings'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (filter === 'expense' && !transaction.isExpense) return false;
    if (filter === 'income' && transaction.isExpense) return false;
    if (filter === 'savings' && !transaction.isSavings) return false;

    // Filter by category
    if (categoryFilter !== 'all' && transaction.category !== categoryFilter) return false;

    // Filter by month and year
    if (monthFilter !== 'All' || yearFilter !== 'All') {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth() + 1; // JavaScript months are 0-indexed
      const transactionYear = transactionDate.getFullYear().toString();

      if (monthFilter !== 'All' && transactionMonth !== MONTHS.indexOf(monthFilter)) return false;
      if (yearFilter !== 'All' && transactionYear !== yearFilter) return false;
    }

    // Filter by search term
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Calculate summary statistics for filtered transactions
  const summaryStats = useMemo(() => {
    const income = filteredTransactions.filter(t => !t.isExpense).reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions.filter(t => t.isExpense && !t.isSavings).reduce((sum, t) => sum + t.amount, 0);
    const savings = filteredTransactions.filter(t => t.isSavings).reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses - savings;

    return { income, expenses, savings, balance };
  }, [filteredTransactions]);

  // Calculate the total amount of filtered transactions
  const totalFilteredAmount = useMemo(() => {
    if (filter === 'expense') {
      return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    } else if (filter === 'income') {
      return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    } else if (filter === 'savings') {
      return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    } else {
      // For 'all' filter, calculate total balance
      return summaryStats.balance;
    }
  }, [filteredTransactions, filter, summaryStats]);

  // Get date range for filtered transactions
  const getDateRangeText = useMemo(() => {
    if (filteredTransactions.length === 0) return "No transactions";

    if (monthFilter !== 'All' && yearFilter !== 'All') {
      return `${monthFilter} ${yearFilter}`;
    }

    // If specific filters are applied, show custom date range
    if (filteredTransactions.length > 0) {
      // Sort transactions by date
      const sortedTransactions = [...filteredTransactions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const oldestDate = new Date(sortedTransactions[0].date);
      const newestDate = new Date(sortedTransactions[sortedTransactions.length - 1].date);

      // Format dates
      const oldestDateStr = oldestDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: yearFilter === 'All' ? 'numeric' : undefined
      });

      const newestDateStr = newestDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: yearFilter === 'All' ? 'numeric' : undefined
      });

      return `${oldestDateStr} - ${newestDateStr}`;
    }

    return yearFilter !== 'All' ? yearFilter : (monthFilter !== 'All' ? monthFilter : "All time");
  }, [filteredTransactions, monthFilter, yearFilter]);

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);
  const groupDates = Object.keys(groupedTransactions);

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  const clearFilters = () => {
    setFilter('all');
    setSearchTerm('');
    setCategoryFilter('all');
    setMonthFilter('All');
    setYearFilter('All');
  };

  const hasActiveFilters = filter !== 'all' || searchTerm || categoryFilter !== 'all' || monthFilter !== 'All' || yearFilter !== 'All';

  const handleExportToExcel = () => {
    let periodName = 'All Transactions';

    if (monthFilter !== 'All' && yearFilter !== 'All') {
      periodName = `${monthFilter} ${yearFilter}`;
    } else if (monthFilter !== 'All') {
      periodName = monthFilter;
    } else if (yearFilter !== 'All') {
      periodName = yearFilter;
    }

    if (filter !== 'all') {
      periodName += ` - ${filter.charAt(0).toUpperCase() + filter.slice(1)}`;
    }

    exportTransactionsToExcel(filteredTransactions, periodName);
  };

  // Get appropriate label for total amount card
  const getTotalAmountLabel = () => {
    if (filter === 'expense') return 'Total Expenses';
    if (filter === 'income') return 'Total Income';
    if (filter === 'savings') return 'Total Savings';
    return 'Net Balance';
  };

  // Get appropriate color for total amount card
  const getTotalAmountColor = () => {
    if (filter === 'expense') return 'from-red-500/20 to-red-600/10 border-red-400/30 text-red-400';
    if (filter === 'income') return 'from-green-500/20 to-green-600/10 border-green-400/30 text-green-400';
    if (filter === 'savings') return 'from-blue-500/20 to-blue-600/10 border-blue-400/30 text-blue-400';
    return 'from-neon-purple/20 to-neon-blue/10 border-neon-purple/30 text-white';
  };

  // Get filter period description
  const getFilterPeriod = () => {
    if (monthFilter !== 'All' && yearFilter !== 'All') {
      return `${monthFilter} ${yearFilter}`;
    } else if (monthFilter !== 'All') {
      return monthFilter;
    } else if (yearFilter !== 'All') {
      return yearFilter;
    }
    return 'All Time';
  };

  // Get icon for the summary card
  const getSummaryIcon = () => {
    if (filter === 'expense') return <ArrowDown className="h-4 w-4 text-red-400" />;
    if (filter === 'income') return <ArrowUp className="h-4 w-4 text-green-400" />;
    if (filter === 'savings') return <PiggyBank className="h-4 w-4 text-blue-400" />;
    return <CalculatorIcon className="h-4 w-4 text-neon-purple" />;
  };

  const handleDeleteWithConfirmation = (id: string) => {
    onDeleteTransaction(id);
  };

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
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm md:text-base font-medium text-white">Transactions</h3>

          </div>

          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/categories')}
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white space-x-1"
              >
                <Grid className="h-3.5 w-3.5" />
                <span className="text-xs">Categories</span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white space-x-1"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    <span className="hidden md:inline text-xs">Export</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 bg-purple-dark border-white/10 p-3">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Export Options</h4>
                    <p className="text-xs text-white/70">Generate an Excel file with current filtered transactions</p>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleExportToExcel}
                        className="w-full mt-2 bg-green-500/80 hover:bg-green-500 text-white"
                        size="sm"
                      >
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Export to Excel
                      </Button>
                    </motion.div>
                    <p className="text-2xs text-white/40 mt-1">
                      {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </motion.div>
          </div>
        </div>

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
                <PiggyBank className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-blue-400" />
                {isMobile ? 'Sav' : 'Savings'}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-1 min-w-[110px] md:min-w-0"
            >
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 md:h-9 text-2xs md:text-xs w-full">
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
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-1 min-w-[110px] md:min-w-0"
            >
              <Select
                value={monthFilter}
                onValueChange={setMonthFilter}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 md:h-9 text-2xs md:text-xs w-full">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1.5 text-white/70" />
                    <SelectValue placeholder="Month" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-purple-dark border-white/10">
                  {MONTHS.map((month) => (
                    <SelectItem key={month} value={month} className="text-white text-xs">
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-1 min-w-[90px] md:min-w-0"
            >
              <Select
                value={yearFilter}
                onValueChange={setYearFilter}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 md:h-9 text-2xs md:text-xs w-full">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="bg-purple-dark border-white/10">
                  {getYearOptions().map((year) => (
                    <SelectItem key={year} value={year} className="text-white text-xs">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {hasActiveFilters && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFilters}
                  className="h-8 md:h-9 w-8 md:w-9 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <FilterX className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Enhanced Summary Cards - Showing more complete stats with date range */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Main Total Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`overflow-hidden border-3 shadow-lg bg-gradient-to-br ${getTotalAmountColor()}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 shadow-inner shadow-white/5">
                    {getSummaryIcon()}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="text-xs text-white/80 font-medium">{getTotalAmountLabel()}</p>
                      <span className="text-2xs text-white/50 ml-2 px-1.5 py-0.5 bg-white/10 rounded-full">{getFilterPeriod()}</span>
                    </div>
                    <p className="text-base md:text-lg font-semibold text-white mt-0.5">
                      {formatCurrency(totalFilteredAmount)}
                    </p>
                    <p className="text-2xs text-white/60 mt-1">
                      {getDateRangeText}
                    </p>
                  </div>
                </div>
                <div className="text-2xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                  {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Stats Card - Only show when we're showing "All" */}
          {filter === 'all' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="overflow-hidden border-3 shadow-lg bg-gradient-to-br from-white/5 to-white/2 border-white/10">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-medium text-white/80">Breakdown</h4>
                    <p className="text-2xs text-white/50">{getDateRangeText}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-md bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center mb-1">
                        <ArrowUp className="h-3 w-3 text-green-400 mr-1" />
                        <p className="text-2xs text-white/60">Income</p>
                      </div>
                      <p className="text-xs font-semibold text-green-400">{formatCurrency(summaryStats.income)}</p>
                    </div>
                    <div className="p-2 rounded-md bg-red-500/10 border border-red-500/20">
                      <div className="flex items-center mb-1">
                        <ArrowDown className="h-3 w-3 text-red-400 mr-1" />
                        <p className="text-2xs text-white/60">Expense</p>
                      </div>
                      <p className="text-xs font-semibold text-red-400">{formatCurrency(summaryStats.expenses)}</p>
                    </div>
                    <div className="p-2 rounded-md bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center mb-1">
                        <PiggyBank className="h-3 w-3 text-blue-400 mr-1" />
                        <p className="text-2xs text-white/60">Savings</p>
                      </div>
                      <p className="text-xs font-semibold text-blue-400">{formatCurrency(summaryStats.savings)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
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
                    variants={slideUp}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* TransactionItem should handle its own navigation if it contains a Link */}
                      <TransactionItem
                        transaction={transaction}
                        onEditClick={onEditTransaction}
                        onDeleteClick={(id) => {
                          // Instead of directly deleting, we'll show a confirmation dialog
                          // The actual deletion happens in the alert dialog action
                        }}
                        actionContent={
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white/50 hover:text-red-400 hover:bg-red-500/10"
                                // Prevent click on button from triggering Link (if TransactionItem uses Link internally)
                                onClick={(e) => e.stopPropagation()}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-purple-dark border-white/10">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Confirm Deletion</AlertDialogTitle>
                                <AlertDialogDescription className="text-white/70">
                                  Are you sure you want to delete this transaction?<br />
                                  <span className="font-semibold text-white/90">{transaction.description}</span> - {formatCurrency(transaction.amount)}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent text-white/70 border-white/10 hover:bg-white/5 hover:text-white">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent Link from triggering
                                    handleDeleteWithConfirmation(transaction.id);
                                  }}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        }
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
