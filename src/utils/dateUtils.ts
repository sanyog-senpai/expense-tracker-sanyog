
import { format, isToday, isYesterday } from 'date-fns';
import { 
  GraduationCap, Car, Utensils, Film, 
  ShoppingBag, Plug, Heart, Plane, PiggyBank, Home, Grid
} from 'lucide-react';

// Function to format the date
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  
  if (isToday(date)) {
    return 'Today';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMMM dd, yyyy');
  }
};

// Function to format the time
export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return format(date, 'h:mm a');
};

// Function to format the currency
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

// Instead of returning JSX directly, return the icon component type
export const getCategoryIcon = (category: string) => {
  // Return the appropriate icon component based on category
  switch (category.toLowerCase()) {
    case 'food':
      return Utensils;
    case 'car':
    case 'transportation':
      return Car;
    case 'education':
      return GraduationCap;
    case 'entertainment':
      return Film;
    case 'shopping':
      return ShoppingBag;
    case 'utilities':
      return Plug;
    case 'health':
      return Heart;
    case 'travel':
      return Plane;
    case 'savings':
      return PiggyBank;
    case 'home':
      return Home;
    case 'other':
    default:
      return Grid;
  }
};

// Get color class based on category
export const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food':
      return 'text-red-400';
    case 'transportation':
      return 'text-blue-400';
    case 'entertainment':
      return 'text-purple-400';
    case 'shopping':
      return 'text-yellow-400';
    case 'utilities':
      return 'text-teal-400';
    case 'health':
      return 'text-green-400';
    case 'education':
      return 'text-orange-400';
    case 'travel':
      return 'text-pink-400';
    case 'savings':
      return 'text-blue-400';
    case 'other':
    default:
      return 'text-neon-purple';
  }
};

export const groupTransactionsByDate = (transactions: any[]) => {
  return transactions.reduce((groups: any, transaction: any) => {
    const date = formatDate(transaction.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});
};
