
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// Types
export type Category = 
  | 'food' 
  | 'transportation' 
  | 'entertainment' 
  | 'shopping' 
  | 'utilities' 
  | 'health' 
  | 'education' 
  | 'travel' 
  | 'other';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: Category;
  isExpense: boolean;
  isSavings?: boolean; // Property for savings
  savingsPurpose?: string; // New property for savings purpose
  remarks?: string; // Optional remarks field
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
}

type TransactionAction = 
  | { type: 'ADD_TRANSACTION', payload: Transaction }
  | { type: 'DELETE_TRANSACTION', payload: string }
  | { type: 'UPDATE_TRANSACTION', payload: Transaction }
  | { type: 'SET_TRANSACTIONS', payload: Transaction[] };

// Initial state
const initialState: TransactionState = {
  transactions: [],
  loading: true
};

// Create context
const TransactionContext = createContext<{
  state: TransactionState;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (transaction: Transaction) => void;
} | undefined>(undefined);

// Persist data to localStorage
const persistData = (data: Transaction[]) => {
  try {
    localStorage.setItem('transactions', JSON.stringify(data));
  } catch (e) {
    console.error('Could not save to localStorage:', e);
  }
};

// Load data from localStorage
const loadPersistedData = (): Transaction[] | null => {
  try {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      return JSON.parse(savedTransactions);
    }
    return null;
  } catch (e) {
    console.error('Could not load from localStorage:', e);
    return null;
  }
};

// Reducer
function transactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  let newTransactions: Transaction[];
  
  switch (action.type) {
    case 'ADD_TRANSACTION':
      newTransactions = [action.payload, ...state.transactions];
      persistData(newTransactions);
      return {
        ...state,
        transactions: newTransactions
      };
      
    case 'DELETE_TRANSACTION':
      newTransactions = state.transactions.filter(transaction => transaction.id !== action.payload);
      persistData(newTransactions);
      return {
        ...state,
        transactions: newTransactions
      };
      
    case 'UPDATE_TRANSACTION':
      newTransactions = state.transactions.map(transaction => 
        transaction.id === action.payload.id ? action.payload : transaction
      );
      persistData(newTransactions);
      return {
        ...state,
        transactions: newTransactions
      };
      
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        loading: false
      };
      
    default:
      return state;
  }
}

// Sample data for initial app experience
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    amount: 1250,
    description: 'Lunch at Spice Garden',
    date: '2023-06-15T12:30:00.000Z',
    category: 'food',
    isExpense: true,
    remarks: 'Business lunch with client'
  },
  {
    id: '2',
    amount: 3599,
    description: 'Movie tickets',
    date: '2023-06-14T19:00:00.000Z',
    category: 'entertainment',
    isExpense: true,
    remarks: 'Date night'
  },
  {
    id: '3',
    amount: 8000,
    description: 'Grocery shopping',
    date: '2023-06-13T10:15:00.000Z',
    category: 'food',
    isExpense: true,
    remarks: 'Weekly groceries'
  },
  {
    id: '4',
    amount: 75000,
    description: 'Salary deposit',
    date: '2023-06-01T09:00:00.000Z',
    category: 'other',
    isExpense: false,
    remarks: 'Monthly salary'
  },
  {
    id: '5',
    amount: 4550,
    description: 'Gas',
    date: '2023-06-10T11:45:00.000Z',
    category: 'transportation',
    isExpense: true,
    remarks: 'Road trip'
  },
  {
    id: '6',
    amount: 20000,
    description: 'Emergency Fund',
    date: '2023-06-05T14:20:00.000Z',
    category: 'other',
    isExpense: false,
    isSavings: true,
    savingsPurpose: 'Emergency expenses',
    remarks: 'Monthly savings'
  }
];

// Provider component
export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const persistedTransactions = loadPersistedData();
    
    if (persistedTransactions && persistedTransactions.length > 0) {
      dispatch({ type: 'SET_TRANSACTIONS', payload: persistedTransactions });
    } else {
      // If no persisted data, load sample data
      dispatch({ type: 'SET_TRANSACTIONS', payload: sampleTransactions });
      // Save sample data to localStorage
      persistData(sampleTransactions);
    }
  }, []);

  // Actions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };

  return (
    <TransactionContext.Provider
      value={{
        state,
        addTransaction,
        deleteTransaction,
        updateTransaction
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook to use the transaction context
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
