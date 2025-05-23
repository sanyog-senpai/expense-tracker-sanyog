import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, updateDoc, arrayUnion, collection, query, where, onSnapshot, addDoc, getDocs } from "firebase/firestore";
import { db } from '@/firebase';
import { useAuth } from './AuthContext'; // Assuming you have an AuthContext

// Default categories that can\'t be deleted
const DEFAULT_CATEGORIES = [
  'food',
  'transportation',
  'entertainment',
  'shopping',
  'utilities',
  'health',
  'education',
  'travel',
  'savings',
  'other'
];

export interface CategoryConfig {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault?: boolean;
  userId?: string;
}

// Color options for categories
export const CATEGORY_COLORS = [
  { name: 'Red', value: 'red' },
  { name: 'Green', value: 'green' },
  { name: 'Blue', value: 'blue' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Purple', value: 'purple' },
  { name: 'Pink', value: 'pink' },
  { name: 'Orange', value: 'orange' },
  { name: 'Teal', value: 'teal' }
];

// Icon options for categories
export const CATEGORY_ICONS = [
  { name: 'Food', value: 'food' },
  { name: 'Transport', value: 'car' },
  { name: 'Education', value: 'education' },
  { name: 'Shopping', value: 'shopping' },
  { name: 'Home', value: 'home' },
  { name: 'Health', value: 'health' },
  { name: 'Travel', value: 'travel' },
  { name: 'Entertainment', value: 'entertainment' },
  { name: 'Savings', value: 'savings' },
  { name: 'Other', value: 'other' }
];

interface CategoryContextType {
  categories: CategoryConfig[];
  addCategory: (category: string, color: string, icon: string) => Promise<void>;
  removeCategory: (categoryId: string) => Promise<boolean>; // Updated to return boolean
  isDefaultCategory: (category: string) => boolean;
  loading: boolean; // Added loading state
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth(); // Assuming useAuth provides loading
  const [categories, setCategories] = useState<CategoryConfig[]>([]);
  const [hiddenCategoryIds, setHiddenCategoryIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Loading state for categories

  // Fetch categories and user's hidden categories
  useEffect(() => {
    let categoriesUnsubscribe: () => void;
    let userUnsubscribe: () => void;

    setLoading(true); // Set loading to true when fetching starts

    if (currentUser) {
      // Listen for user's hidden categories
      const userRef = doc(db, "users", currentUser.uid);
      userUnsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setHiddenCategoryIds(userData.hiddenCategoryIds || []);
        } else {
          setHiddenCategoryIds([]);
        }
      }, (error) => {
        console.error("Error fetching user document:", error);
        setHiddenCategoryIds([]); // Clear hidden categories on error
      });

      // Listen for ALL categories (both default and user's custom)
      // We will filter by hiddenCategoryIds later
      const categoriesRef = collection(db, "categories");
      const q = query(categoriesRef); // Fetch all categories initially

      categoriesUnsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedCategories: CategoryConfig[] = [];
        snapshot.forEach((doc) => {
          const categoryData = doc.data();
          fetchedCategories.push({
            id: doc.id,
            name: categoryData.name,
            color: categoryData.color,
            icon: categoryData.icon,
            isDefault: categoryData.isDefault || false,
            userId: categoryData.userId
          });
        });

        // Filter out hidden categories based on the latest hiddenCategoryIds
        const visibleCategories = fetchedCategories.filter(
          category => !hiddenCategoryIds.includes(category.id)
        );

        setCategories(visibleCategories);
        setLoading(false); // Set loading to false when categories are loaded
      }, (error) => {
        console.error("Error fetching categories from Firebase:", error);
        setCategories([]); // Clear categories on error
        setLoading(false); // Set loading to false on error
      });
    } else {
      // User is not logged in, clear categories and set loading to false
      setCategories([]);
      setHiddenCategoryIds([]);
      setLoading(false);
    }

    // Cleanup listeners
    return () => {
      if (categoriesUnsubscribe) categoriesUnsubscribe();
      if (userUnsubscribe) userUnsubscribe();
    };
  }, [currentUser, hiddenCategoryIds]); // Added hiddenCategoryIds to dependencies


  const addCategory = async (category: string, color: string, icon: string) => {
    if (!currentUser) {
      console.error("User must be logged in to add categories");
      // Consider showing a toast or other user feedback
      return;
    }

    const normalizedCategory = category.toLowerCase().trim();

    // Check for duplicates among visible and hidden categories for the current user
    const allUserCategories = categories.concat(
        hiddenCategoryIds.map(id => {
            // Find the full category object for the hidden ID if available
            const hiddenCat = categories.find(cat => cat.id === id);
            if (hiddenCat) return hiddenCat;
            // If not in current categories state (maybe due to initial load or filter),
            // create a placeholder with just the ID and assuming it's a user category
            return { id, name: '', color: '', icon: '', isDefault: false, userId: currentUser.uid };
        }).filter(cat => cat.userId === currentUser.uid) // Only consider user's own categories for duplicate check
    );


    const existingCategory = allUserCategories.find(
      c => c.name === normalizedCategory
    );

    if (existingCategory) {
      console.error("Category already exists for this user");
      // Consider showing a toast or other user feedback
      return;
    }

    try {
      await addDoc(collection(db, "categories"), {
        name: normalizedCategory,
        color,
        icon,
        userId: currentUser.uid, // Assign category to the current user
        isDefault: false // User-added categories are not default
      });
      // Consider showing a success toast here
    } catch (error) {
      console.error("Error adding category:", error);
      // Consider showing an error toast here
      throw error; // Re-throw to allow component to handle
    }
  };

  // removeCategory now performs soft delete by adding categoryId to hiddenCategoryIds
  const removeCategory = async (categoryId: string): Promise<boolean> => {
    if (!currentUser) {
      console.error("User must be logged in to remove categories");
      return false; // Indicate failure
    }

    // Check if the category is linked to transactions
    const hasLinkedTransactions = await hasTransactions(categoryId);
    if (hasLinkedTransactions) {
      console.error("Cannot hide category: It is linked to transactions");
      return false; // Indicate failure
    }

    try {
      await hideCategoryForUser(currentUser.uid, categoryId);
      return true; // Indicate success
    } catch (error) {
      console.error("Error hiding category:", error);
      return false; // Indicate failure
    }
  };

  const hasTransactions = async (categoryId: string): Promise<boolean> => {
    try {
      const transactionsRef = collection(db, "transactions");
      const q = query(transactionsRef, where("categoryId", "==", categoryId));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking for transactions:", error);
      // In case of error, assume it has transactions to be safe
      return true;
    }
  };

  const hideCategoryForUser = async (userId: string, categoryId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        hiddenCategoryIds: arrayUnion(categoryId)
      });
    } catch (error) {
      console.error("Error hiding category:", error);
      throw error; // Re-throw to allow calling function to handle
    }
  };

  const isDefaultCategory = (categoryName: string): boolean => {
     return DEFAULT_CATEGORIES.includes(categoryName.toLowerCase().trim());
  };

  return (
    <CategoryContext.Provider value={{
      categories,
      addCategory,
      removeCategory,
      isDefaultCategory,
      loading // Provide loading state
    }}>
      {children}
    </CategoryContext.Provider>
  );
};
