import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Coffee, ShoppingBag, GraduationCap, Car, Utensils, Palmtree, Home, Heart, PiggyBank, Grid } from 'lucide-react';

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

export interface CategoryConfig {
  name: string;
  color: string;
  icon: string;
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
  categories: string[];
  categoryConfigs: Record<string, {color: string, icon: string}>;
  addCategory: (category: string, color: string, icon: string) => void;
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
  
  // Keep track of category configurations (color, icon)
  const [categoryConfigs, setCategoryConfigs] = useState<Record<string, {color: string, icon: string}>>(() => {
    const storedConfigs = localStorage.getItem('categoryConfigs');
    const defaultConfigs = {
      'food': { color: 'red', icon: 'food' },
      'transportation': { color: 'blue', icon: 'car' },
      'entertainment': { color: 'purple', icon: 'entertainment' },
      'shopping': { color: 'yellow', icon: 'shopping' },
      'utilities': { color: 'teal', icon: 'home' },
      'health': { color: 'green', icon: 'health' },
      'education': { color: 'orange', icon: 'education' },
      'travel': { color: 'pink', icon: 'travel' },
      'savings': { color: 'blue', icon: 'savings' },
      'other': { color: 'purple', icon: 'other' }
    };
    
    if (storedConfigs) {
      return { ...defaultConfigs, ...JSON.parse(storedConfigs) };
    }
    return defaultConfigs;
  });
  
  // Save custom categories to localStorage when they change
  useEffect(() => {
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
  }, [customCategories]);
  
  // Save category configs to localStorage when they change
  useEffect(() => {
    localStorage.setItem('categoryConfigs', JSON.stringify(categoryConfigs));
  }, [categoryConfigs]);
  
  const addCategory = (category: string, color: string, icon: string) => {
    const normalizedCategory = category.toLowerCase().trim();
    
    // Check if category already exists
    if (categories.includes(normalizedCategory)) {
      return;
    }
    
    // Add to both categories and customCategories
    setCategories(prev => [...prev, normalizedCategory]);
    setCustomCategories(prev => [...prev, normalizedCategory]);
    
    // Add configuration
    setCategoryConfigs(prev => ({
      ...prev,
      [normalizedCategory]: { color, icon }
    }));
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
    
    // Remove configuration
    setCategoryConfigs(prev => {
      const newConfigs = { ...prev };
      delete newConfigs[normalizedCategory];
      return newConfigs;
    });
  };
  
  const isDefaultCategory = (category: string) => {
    return DEFAULT_CATEGORIES.includes(category.toLowerCase().trim());
  };
  
  return (
    <CategoryContext.Provider value={{ 
      categories,
      categoryConfigs,
      addCategory,
      removeCategory,
      isDefaultCategory
    }}>
      {children}
    </CategoryContext.Provider>
  );
};
