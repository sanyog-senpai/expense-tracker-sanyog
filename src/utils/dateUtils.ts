
import {
  BookOpen,
  Book,
  Bus,
  CalendarClock,
  Car,
  Coffee,
  Gamepad2,
  Github,
  GraduationCap,
  HeartPulse,
  Home,
  IndianRupee,
  Lightbulb,
  MonitorSmartphone,
  Pizza,
  ShoppingCart,
  Ticket,
  Trees,
  Wallet,
} from "lucide-react";

// Function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Function to format date
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Function to format time
export const formatTime = (date: string): string => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Category colors
export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "food":
      return "bg-red-500";
    case "transportation":
      return "bg-blue-500";
    case "entertainment":
      return "bg-purple-500";
    case "shopping":
      return "bg-yellow-500";
    case "utilities":
      return "bg-gray-500";
    case "health":
      return "bg-pink-500";
    case "education":
      return "bg-orange-500";
    case "travel":
      return "bg-teal-500";
    case "savings":
      return "bg-blue-600";
    default:
      return "bg-indigo-500";
  }
};

// Category icons
export const getCategoryIcon = (category: string): any => {
  switch (category) {
    case "food":
      return Pizza;
    case "transportation":
      return Bus;
    case "entertainment":
      return Gamepad2;
    case "shopping":
      return ShoppingCart;
    case "utilities":
      return Lightbulb;
    case "health":
      return HeartPulse;
    case "education":
      return GraduationCap;
    case "travel":
      return Trees;
    case "savings":
      return Wallet; // Replaced Bank with Wallet
    default:
      return IndianRupee;
  }
};

// Function to get current date in Nepal time
export const getCurrentDateInNepalTime = (): string => {
  const now = new Date();
  
  // Nepal is UTC+5:45
  const nepalOffsetHours = 5;
  const nepalOffsetMinutes = 45;
  
  // Get the UTC time
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  
  // Create a new date with Nepal time
  const nepalTime = new Date(utc + (3600000 * nepalOffsetHours) + (60000 * nepalOffsetMinutes));
  
  // Format to ISO string and return the date part
  return nepalTime.toISOString();
};

// Group transactions by date for display in TransactionList
export const groupTransactionsByDate = (transactions: any[]): Record<string, any[]> => {
  const grouped: Record<string, any[]> = {};
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (!grouped[formattedDate]) {
      grouped[formattedDate] = [];
    }
    
    grouped[formattedDate].push(transaction);
  });
  
  // Sort dates newest first
  return Object.keys(grouped)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .reduce((result: Record<string, any[]>, key) => {
      result[key] = grouped[key];
      return result;
    }, {});
};
