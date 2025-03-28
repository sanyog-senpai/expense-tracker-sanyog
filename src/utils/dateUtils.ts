
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ne-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  if (isToday(date)) {
    return 'Today';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else if (isThisWeek(date)) {
    return format(date, 'EEEE'); // Day name
  } else if (isThisMonth(date)) {
    return format(date, 'MMMM d'); // Month day
  } else if (isThisYear(date)) {
    return format(date, 'MMMM d'); // Month day
  } else {
    return format(date, 'MMM d, yyyy'); // Month day, year
  }
};

export const formatTime = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'h:mm a');
};

export const groupTransactionsByDate = (transactions: any[]) => {
  const groups: Record<string, any[]> = {};
  
  transactions.forEach(transaction => {
    const date = formatDate(transaction.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
  });
  
  // Sort each group by time (newest first)
  Object.keys(groups).forEach(date => {
    groups[date].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  });
  
  return groups;
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    food: 'bg-orange-500',
    transportation: 'bg-blue-500',
    entertainment: 'bg-purple-500',
    shopping: 'bg-pink-500',
    utilities: 'bg-yellow-500',
    health: 'bg-green-500',
    education: 'bg-indigo-500',
    travel: 'bg-teal-500',
    other: 'bg-gray-500'
  };
  
  return colors[category] || 'bg-gray-500';
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    food: '🍔',
    transportation: '🚗',
    entertainment: '🎬',
    shopping: '🛍️',
    utilities: '💡',
    health: '⚕️',
    education: '📚',
    travel: '✈️',
    other: '📦'
  };
  
  return icons[category] || '📦';
};
