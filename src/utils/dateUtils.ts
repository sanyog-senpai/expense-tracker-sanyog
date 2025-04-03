import { format, isToday, isYesterday } from 'date-fns';

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

// Function to group transactions by date
import React from 'react';
import { 
  Coffee, ShoppingBag, Music, MusicIcon, DollarSign, Banknote, 
  GraduationCap, Car, Bus, Utensils, Palmtree, Film, 
  Home, Heart, Stethoscope, PiggyBank, Grid, CreditCard,
  Ticket, BookOpen, Dumbbell, ShoppingCart, Droplet, Plug,
  Map, Plane, Gift, Tv, Smartphone
} from 'lucide-react';

// Get icon based on category name or icon name
export const getCategoryIcon = (category: string) => {
  // First, check if we're receiving the icon name directly
  switch (category.toLowerCase()) {
    case 'food':
      return <Utensils className="h-4 w-4" />;
    case 'car':
    case 'transportation':
      return <Car className="h-4 w-4" />;
    case 'education':
      return <GraduationCap className="h-4 w-4" />;
    case 'entertainment':
      return <Film className="h-4 w-4" />;
    case 'shopping':
      return <ShoppingBag className="h-4 w-4" />;
    case 'utilities':
      return <Plug className="h-4 w-4" />;
    case 'health':
      return <Heart className="h-4 w-4" />;
    case 'travel':
      return <Plane className="h-4 w-4" />;
    case 'savings':
      return <PiggyBank className="h-4 w-4" />;
    case 'home':
      return <Home className="h-4 w-4" />;
    case 'other':
    default:
      return <Grid className="h-4 w-4" />;
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
