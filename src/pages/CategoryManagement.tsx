import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategories, CATEGORY_COLORS, CATEGORY_ICONS, CategoryConfig } from '@/context/CategoryContext'; // Import CategoryConfig
import { getCategoryIcon } from '@/utils/dateUtils';
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '@/lib/animations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from '@/context/AuthContext';


// Define the type for category objects including the id
interface Category extends CategoryConfig {
  id: string;
  // isDefault is already in CategoryConfig
}

const CategoryManagement = () => {
  // Update the type for categories state
  const { categories, loading, removeCategory, addCategory } = useCategories();
  const { currentUser } = useAuth(); // Get currentUser from AuthContext

  const [newCategory, setNewCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('purple');
  const [selectedIcon, setSelectedIcon] = useState('other');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // categoryToDelete should store the category ID
  const [categoryToDeleteId, setCategoryToDeleteId] = useState<string | null>(null);
  // State to store the category object to display in the dialog
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);


  // Find the category object based on categoryToDeleteId
  useEffect(() => {
    if (categoryToDeleteId) {
      const foundCategory = categories.find(cat => cat.id === categoryToDeleteId);
      setCategoryToDelete(foundCategory || null);
    } else {
      setCategoryToDelete(null);
    }
  }, [categoryToDeleteId, categories]);


  const handleAddCategory = async () => { // Made async to await addCategory
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    // Check if category already exists locally (basic check before async operation)
    // The duplicate check in CategoryContext is more comprehensive
    // but a local check can provide faster feedback
    if (categories.some(cat => cat.name.toLowerCase() === newCategory.toLowerCase().trim())) {
         toast({
           title: "Error",
           description: "This category already exists",
           variant: "destructive",
         });
         return;
       }

    try {
        await addCategory(newCategory.trim(), selectedColor, selectedIcon); // addCategory now writes to Firestore and is async

        // Optional: Show success toast here if addCategory doesn't handle it
        // toast({
        //   title: "Success",
        //   description: `${newCategory.trim()} category added`,
        // });

       setNewCategory('');
    } catch (error: any) { // Catch potential errors from addCategory
        toast({
            title: "Error adding category",
            description: error.message || "An unexpected error occurred",
            variant: "destructive",
        });
    }
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDeleteId) {
      try {
        const success = await removeCategory(categoryToDeleteId); // removeCategory now returns boolean

        if (success) {
            toast({
              title: "Category hidden", // Changed toast message for soft delete
              description: `${categoryToDelete?.name || 'Category'} has been deleted successfully`,
            });
        } else {
             // removeCategory already shows a toast for failure (e.g., linked transactions)
             // so we don't need another toast here unless you want a generic error
             console.log("Category not hidden, likely due to linked transactions or other error");
        }

      } catch (error) {
        // This catch might be redundant if removeCategory handles all errors internally
        console.error("Error during category removal confirmation:", error);
        toast({
            title: "Error",
            description: `An unexpected error occurred while trying to hide "${categoryToDelete?.name || 'Category'}".`,
            variant: "destructive",
          });
      }

      setIsDeleteDialogOpen(false);
      setCategoryToDeleteId(null);
      setCategoryToDelete(null); // Clear categoryToDelete state as well
    }
  };

  // Open delete dialog, storing the category ID
  const openDeleteDialog = (categoryId: string) => {
    setCategoryToDeleteId(categoryId);
    setIsDeleteDialogOpen(true);
  };

  // Helper function to get the background color class for the category
  const getCategoryColorClass = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500/20 text-red-400';
      case 'green': return 'bg-green-500/20 text-green-400';
      case 'blue': return 'bg-blue-500/20 text-blue-400';
      case 'yellow': return 'bg-yellow-500/20 text-yellow-400';
      case 'purple': return 'bg-neon-purple/20 text-neon-purple';
      case 'pink': return 'bg-neon-pink/20 text-neon-pink';
      case 'orange': return 'bg-orange-500/20 text-orange-400';
      case 'teal': return 'bg-teal-500/20 text-teal-400';
      default: return 'bg-neon-purple/20 text-neon-purple';
    }
  };

  // Generate a preview of the selected color and icon
  const getColorPreview = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'green': return 'bg-green-500';
      case 'blue': return 'bg-blue-500';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-neon-purple';
      case 'pink': return 'bg-neon-pink';
      case 'orange': return 'bg-orange-500';
      case 'teal': return 'bg-teal-500';
      default: return 'bg-neon-purple';
    }
  };

  // Helper function to render the icon component
  const renderCategoryIcon = (iconName: string) => {
    const IconComponent = getCategoryIcon(iconName);
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <Layout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="pb-32"
      >
        <div className="flex items-center mb-6">
          <Link to="/?tab=transactions">
            <Button variant="ghost" size="icon" className="mr-2 text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Manage Categories</h1>
        </div>

        <motion.div
          variants={slideUp}
          className="mb-8"
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 md:p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Add New Category</h2>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="category" className="text-white/70 mb-1.5 block text-xs">Category Name</Label>
                  <Input
                    id="category"
                    placeholder="Enter category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="bg-white/5 border-white/10 text-white focus:border-neon-purple/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color" className="text-white/70 mb-1.5 block text-xs">Category Color</Label>
                    <Select
                      value={selectedColor}
                      onValueChange={setSelectedColor}
                    >
                      <SelectTrigger
                        id="color"
                        className="bg-white/5 border-white/10 text-white focus:ring-neon-purple/20 focus:ring-offset-0"
                      >
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-dark border-white/10">
                        {CATEGORY_COLORS.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full mr-2 ${getColorPreview(color.value)}`}></div>
                              <span>{color.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="icon" className="text-white/70 mb-1.5 block text-xs">Category Icon</Label>
                    <Select
                      value={selectedIcon}
                      onValueChange={setSelectedIcon}
                    >
                      <SelectTrigger
                        id="icon"
                        className="bg-white/5 border-white/10 text-white focus:ring-neon-purple/20 focus:ring-offset-0"
                      >
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-dark border-white/10">
                        {CATEGORY_ICONS.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center">
                              <div className="mr-2 text-white">
                                {renderCategoryIcon(icon.value)}
                              </div>
                              <span>{icon.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-3 mt-2 mb-4">
                    <div className="text-sm text-white/70">Preview:</div>
                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${getCategoryColorClass(selectedColor)}`}> {/* Use selectedColor for preview */}
                      {renderCategoryIcon(selectedIcon)}
                      <span>{newCategory || 'Category Name'}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAddCategory}
                  className="bg-neon-purple hover:bg-neon-purple/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={slideUp} className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Your Categories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Removed the incorrect filter here */}
            {categories.map((category) => {
                const isDefault = category.isDefault || false;
                const { id, name, color, icon } = category;

                return (
                  <motion.div
                    key={id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className={`bg-white/5 hover:bg-white/10 border-white/10 transition-all border-l-4 ${getCategoryColorClass(color).includes('bg-') ? getCategoryColorClass(color).replace('text-', 'border-l-').replace('/20', '') : 'border-l-neon-purple'}`}>
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getCategoryColorClass(color)}`}>
                            {renderCategoryIcon(icon)}
                          </div>
                          <div>
                            <p className="text-white font-medium capitalize">{name}</p>
                            {isDefault && (
                              <p className="text-2xs text-white/50">Default category</p>
                            )}
                          </div>
                        </div>

                        {/* The delete button is now visible for all categories that are not truly non-deletable system categories */}
                        {/* If you have categories that should NEVER be deletable/hideable, you'll need a different property than isDefault */}
                         <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(id)}
                          className="text-white/40 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>

      </motion.div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-purple-dark border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Delete</DialogTitle> {/* Changed title */}
            <DialogDescription className="text-white/70">
              Are you sure you want to delete the "{categoryToDelete?.name || 'Category'}" category? {/* Changed description */}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Category {/* Changed button text */}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CategoryManagement;
