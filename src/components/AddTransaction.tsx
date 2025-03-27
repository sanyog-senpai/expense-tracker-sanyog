
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction, Category } from '@/context/TransactionContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  editTransaction?: Transaction;
}

const CATEGORIES: Category[] = [
  'food',
  'transportation',
  'entertainment',
  'shopping',
  'utilities',
  'health',
  'education',
  'travel',
  'other'
];

const AddTransaction: React.FC<AddTransactionProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  editTransaction 
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [isExpense, setIsExpense] = useState(true);
  const [error, setError] = useState('');
  
  // Reset form or fill with edit data when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (editTransaction) {
        setDescription(editTransaction.description);
        setAmount(editTransaction.amount.toString());
        setCategory(editTransaction.category);
        setIsExpense(editTransaction.isExpense);
      } else {
        setDescription('');
        setAmount('');
        setCategory('other');
        setIsExpense(true);
      }
      setError('');
    }
  }, [isOpen, editTransaction]);
  
  const handleSave = () => {
    // Validate inputs
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    // Create transaction object
    const transaction: Omit<Transaction, 'id'> = {
      description: description.trim(),
      amount: Number(amount),
      category,
      date: new Date().toISOString(),
      isExpense
    };
    
    onSave(transaction);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <Tabs 
            defaultValue={isExpense ? "expense" : "income"} 
            className="w-full" 
            onValueChange={(val) => setIsExpense(val === "expense")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="expense" 
                className={cn(
                  "flex items-center justify-center",
                  isExpense && "data-[state=active]:bg-red-100 data-[state=active]:text-red-600"
                )}
              >
                <MinusCircle className="h-4 w-4 mr-2" />
                Expense
              </TabsTrigger>
              <TabsTrigger 
                value="income"
                className={cn(
                  "flex items-center justify-center",
                  !isExpense && "data-[state=active]:bg-green-100 data-[state=active]:text-green-600"
                )}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Income
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this transaction for?"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category} 
              onValueChange={(value: Category) => setCategory(value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {error && (
            <div className="text-destructive text-sm">{error}</div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransaction;
