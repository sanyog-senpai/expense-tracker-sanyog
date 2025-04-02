
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { ChevronLeft, Plus, Trash2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { getCategoryColor, getCategoryIcon } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Create/update CategoryContext
import { useCategories } from '@/context/CategoryContext';

const CategoryManagement = () => {
  const { categories, addCategory, removeCategory } = useCategories();
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAddCategory = () => {
    // Basic validation
    if (!newCategory.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    // Check if category already exists
    if (categories.includes(newCategory.toLowerCase())) {
      setError('This category already exists');
      return;
    }
    
    // Add category
    addCategory(newCategory.toLowerCase());
    setNewCategory('');
    setError('');
    
    toast({
      title: 'Category added',
      description: `"${newCategory}" has been added to your categories.`
    });
  };
  
  const handleDeleteCategory = (category: string) => {
    removeCategory(category);
    
    toast({
      title: 'Category removed',
      description: `"${category}" has been removed from your categories.`
    });
  };
  
  return (
    <div className="min-h-screen bg-purple-dark p-4 md:p-6">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 mb-6"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-white/10 overflow-hidden bg-white/5 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Manage Categories</CardTitle>
              <CardDescription className="text-white/70">
                Add or remove transaction categories
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="New category name"
                    value={newCategory}
                    onChange={(e) => {
                      setNewCategory(e.target.value);
                      if (error) setError('');
                    }}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  />
                  <Button 
                    onClick={handleAddCategory}
                    className="bg-neon-purple hover:bg-neon-purple/90 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                {error && (
                  <p className="text-xs text-red-400 mt-1">{error}</p>
                )}
                
                <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                  <h3 className="text-sm text-white font-medium mb-3">Your Categories</h3>
                  
                  {categories.length === 0 ? (
                    <p className="text-white/50 text-xs py-2">No custom categories yet</p>
                  ) : (
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <motion.div 
                          key={category}
                          className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.07)' }}
                        >
                          <div className="flex items-center">
                            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center mr-3', getCategoryColor(category))}>
                              <span className="text-base">{getCategoryIcon(category)}</span>
                            </div>
                            <span className="text-white capitalize">{category}</span>
                          </div>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-white/50 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-purple-dark border-white/10">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Delete Category</AlertDialogTitle>
                                <AlertDialogDescription className="text-white/70">
                                  Are you sure you want to delete the "{category}" category? This will not delete any transactions with this category.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent text-white/70 border-white/10 hover:bg-white/5 hover:text-white">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                  onClick={() => handleDeleteCategory(category)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-white/5 px-6 py-4 flex justify-between">
              <p className="text-xs text-white/60">
                Default categories cannot be removed
              </p>
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/15 border-white/10 text-white"
                onClick={() => navigate('/')}
              >
                <Save className="h-4 w-4 mr-2" />
                Done
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryManagement;
