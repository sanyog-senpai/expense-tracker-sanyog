
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

// Reducer
function transactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction => 
          transaction.id === action.payload.id ? action.payload : transaction
        )
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

// Provider component
export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        const parsedTransactions = JSON.parse(savedTransactions);
        dispatch({ type: 'SET_TRANSACTIONS', payload: parsedTransactions });
      } catch (error) {
        console.error('Error parsing saved transactions:', error);
        dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
      }
    } else {
      // Sample data
      const sampleTransactions: Transaction[] = [
        {
          id: '1',
          amount: 25.50,
          description: 'Lunch at Sushi Place',
          date: '2023-06-15T12:30:00.000Z',
          category: 'food',
          isExpense: true
        },
        {
          id: '2',
          amount: 35.99,
          description: 'Movie tickets',
          date: '2023-06-14T19:00:00.000Z',
          category: 'entertainment',
          isExpense: true
        },
        {
          id: '3',
          amount: 80.00,
          description: 'Grocery shopping',
          date: '2023-06-13T10:15:00.000Z',
          category: 'food',
          isExpense: true
        },
        {
          id: '4',
          amount: 1250.00,
          description: 'Salary deposit',
          date: '2023-06-01T09:00:00.000Z',
          category: 'other',
          isExpense: false
        },
        {
          id: '5',
          amount: 45.50,
          description: 'Gas',
          date: '2023-06-10T11:45:00.000Z',
          category: 'transportation',
          isExpense: true
        }
      ];
      dispatch({ type: 'SET_TRANSACTIONS', payload: sampleTransactions });
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem('transactions', JSON.stringify(state.transactions));
    }
  }, [state.transactions, state.loading]);

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
