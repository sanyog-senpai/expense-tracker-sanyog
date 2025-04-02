import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Default categories that can't be deleted
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

interface CategoryContextType {
  categories: string[];
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  isDefaultCategory: (category: string) => boolean;
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
  // Initialize with default categories and any custom ones from localStorage
  const [categories, setCategories] = useState<string[]>(() => {
    const storedCategories = localStorage.getItem('customCategories');
    const customCategories = storedCategories ? JSON.parse(storedCategories) : [];
    
    // Combine default and custom categories
    return [...DEFAULT_CATEGORIES, ...customCategories];
  });
  
  // Keep track of custom categories separately
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    const storedCategories = localStorage.getItem('customCategories');
    return storedCategories ? JSON.parse(storedCategories) : [];
  });
  
  // Save custom categories to localStorage when they change
  useEffect(() => {
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
  }, [customCategories]);
  
  const addCategory = (category: string) => {
    const normalizedCategory = category.toLowerCase().trim();
    
    // Check if category already exists
    if (categories.includes(normalizedCategory)) {
      return;
    }
    
    // Add to both categories and customCategories
    setCategories(prev => [...prev, normalizedCategory]);
    setCustomCategories(prev => [...prev, normalizedCategory]);
  };
  
  const removeCategory = (category: string) => {
    const normalizedCategory = category.toLowerCase().trim();
    
    // Don't allow removal of default categories
    if (DEFAULT_CATEGORIES.includes(normalizedCategory)) {
      return;
    }
    
    // Remove from both categories and customCategories
    setCategories(prev => prev.filter(c => c !== normalizedCategory));
    setCustomCategories(prev => prev.filter(c => c !== normalizedCategory));
  };
  
  const isDefaultCategory = (category: string) => {
    return DEFAULT_CATEGORIES.includes(category.toLowerCase().trim());
  };
  
  return (
    <CategoryContext.Provider value={{ 
      categories,
      addCategory,
      removeCategory,
      isDefaultCategory
    }}>
      {children}
    </CategoryContext.Provider>
  );
};
