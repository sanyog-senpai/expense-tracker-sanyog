import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming you have a firebase.ts with initialized Firestore
import { useAuth } from './AuthContext'; // Import useAuth
  import { doc, deleteDoc,updateDoc } from "firebase/firestore"; // Import necessary functions

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
  | 'savings'
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
  | { type: 'SET_TRANSACTIONS', payload: Transaction[] }
  | { type: 'CLEAR_TRANSACTIONS' };  // New action type

// Initial state
const initialState: TransactionState = {
  transactions: [],
  loading: true
};

// Create context
interface TransactionContextType {
  state: TransactionState;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>; // add async here
  deleteTransaction: (id: string) => void;
  updateTransaction: (transaction: Transaction) => void;
  clearAllTransactions: () => void; // New function to clear all transactions
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Persist data to localStorage
// const persistData = (data: Transaction[]) => {
//   try {
//     localStorage.setItem('transactions', JSON.stringify(data));
//   } catch (e) {
//     console.error('Could not save to localStorage:', e);
//   }
// };

// Load data from localStorage
// const loadPersistedData = (): Transaction[] | null => {
//   try {
//     const savedTransactions = localStorage.getItem('transactions');
//     if (savedTransactions) {
//       return JSON.parse(savedTransactions);
//     }
//     return null;
//   } catch (e) {
//     console.error('Could not load from localStorage:', e);
//     return null;
//   }
// };

// Reducer
function transactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  let newTransactions: Transaction[];

  switch (action.type) {
    case 'ADD_TRANSACTION':
      newTransactions = [action.payload, ...state.transactions];
      // persistData(newTransactions);
      return {
        ...state,
        transactions: newTransactions
      };

    case 'DELETE_TRANSACTION':
      newTransactions = state.transactions.filter(transaction => transaction.id !== action.payload);
      // persistData(newTransactions);
      return {
        ...state,
        transactions: newTransactions
      };

    case 'UPDATE_TRANSACTION':
      newTransactions = state.transactions.map(transaction =>
        transaction.id === action.payload.id ? action.payload : transaction
      );
      // persistData(newTransactions);
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

    case 'CLEAR_TRANSACTIONS': // Handle the new action
      // persistData([]);
      return {
        ...state,
        transactions: [],
        loading: false
      };

    default:
      return state;
  }
}

// Provider component
export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [state, dispatch] = useReducer(transactionReducer, initialState);
  const { currentUser, loading: authLoading } = useAuth(); // Call useAuth at the top level

  // Load transactions from localStorage on mount and fetch from Firebase
  useEffect(() => {
    // Load from localStorage first (optional)
    // const persistedTransactions = loadPersistedData();
    // if (persistedTransactions && persistedTransactions.length > 0) {
    //   dispatch({ type: 'SET_TRANSACTIONS', payload: persistedTransactions });
    // } else {
    //   dispatch({ type: 'SET_TRANSACTIONS', payload: [] }); // Initialize empty
    // }

    let unsubscribe: () => void; // To store the unsubscribe function

    // Fetch from Firebase when user is authenticated and auth is not loading
    if (currentUser && !authLoading) {
      const transactionsCollection = collection(db, 'transactions');
      // Assuming your transactions in Firestore have a 'userId' field
      const userTransactionsQuery = query(transactionsCollection, where('userId', '==', currentUser.uid));

      unsubscribe = onSnapshot(userTransactionsQuery, (snapshot) => {
        // console.log("Fetching transactions from Firebase..."); // Debug log
        const fetchedTransactions: Transaction[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            amount: data.amount,
            description: data.description,
            date: data.date && data.date.seconds
            ? new Date(data.date.seconds * 1000).toISOString()
            : '', // Handle Firebase Timestamp
            

            category: data.category,
            isExpense: data.isExpense,
            isSavings: data.isSavings,
            savingsPurpose: data.savingsPurpose,
            remarks: data.remarks,
            // ... map other fields you have in your transaction document
          };
        });
        // console.log("Fetched transactions:", fetchedTransactions); // Debug log
        dispatch({ type: 'SET_TRANSACTIONS', payload: fetchedTransactions });
      }, (error) => {
        console.error("Error fetching transactions from Firebase:", error); // Error handling
      });
    }

    return () => {
      // Cleanup the listener when component unmounts or dependencies change
      if (unsubscribe) {
        unsubscribe();
      }
    };

  }, [currentUser, authLoading]); // Re-run effect when currentUser or authLoading changes


  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    // currentUser is now available from the useAuth() call at the top level

    if (!currentUser) {
      console.error('No authenticated user to add transaction for.');
      // Optionally, show an error message to the user
      return;
    }

    const newTransactionData = { // Renamed to newTransactionData to avoid conflict with local state object
      ...transaction,
      userId: currentUser.uid, // Add the user ID
      date: new Date(transaction.date), // Convert date string to Date object for Firebase Timestamp
    };

    try {
      console.log("Attempting to add transaction to Firestore:", newTransactionData); // Debug log
      // Add the transaction to Firestore
      const docRef = await addDoc(collection(db, 'transactions'), newTransactionData);

      console.log('Transaction added to Firestore with ID:', docRef.id);

      // The onSnapshot listener will automatically update the local state
      // No need to dispatch ADD_TRANSACTION here

    } catch (e) {
      console.error('Error adding transaction to Firestore:', e);
      // Optionally, show an error message to the user
    }
  };

    const deleteTransaction = async (id: string) => { // Make the function async
      try {
        const transactionRef = doc(db, "transactions", id); // Get reference to the document
        await deleteDoc(transactionRef); // Delete the document
        dispatch({ type: 'DELETE_TRANSACTION', payload: id }); // Dispatch after successful deletion
        console.log("Transaction successfully deleted from Firebase!"); // Optional: log success
      } catch (error) {
        console.error("Error removing transaction: ", error); // Handle errors
        // You might want to show an error message to the user
      }
    };


    const updateTransaction = async (transaction: Transaction) => { // Make the function async
      try {
        const transactionRef = doc(db, "transactions", transaction.id); // Get reference to the document
        // Use updateDoc to update the document with the new transaction data
        await updateDoc(transactionRef, {
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date, // Ensure date is in a format Firebase understands (e.g., ISO string or Timestamp)
          category: transaction.category,
          isExpense: transaction.isExpense,
          isSavings: transaction.isSavings,
          savingsPurpose: transaction.savingsPurpose,
          remarks: transaction.remarks,
          // Add other fields if necessary
        });
        dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction }); // Dispatch after successful update
        console.log("Transaction successfully updated in Firebase!"); // Optional: log success
      } catch (error) {
        console.error("Error updating transaction: ", error); // Handle errors
        // You might want to show an error message to the user
      }
    };

  // New function to clear all transactions
  const clearAllTransactions = () => {
    // TODO: Implement Firebase logic to delete all user transactions here
    dispatch({ type: 'CLEAR_TRANSACTIONS' });
  };

  return (
    <TransactionContext.Provider
      value={{
        state,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        clearAllTransactions
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
