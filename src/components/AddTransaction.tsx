
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction, Category } from '@/context/TransactionContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, MinusCircle, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

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
  const [transactionType, setTransactionType] = useState<'expense' | 'income' | 'savings'>('expense');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  
  // Reset form or fill with edit data when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (editTransaction) {
        setDescription(editTransaction.description);
        setAmount(editTransaction.amount.toString());
        setCategory(editTransaction.category);
        if (editTransaction.isSavings) {
          setTransactionType('savings');
        } else {
          setTransactionType(editTransaction.isExpense ? 'expense' : 'income');
        }
        setRemarks(editTransaction.remarks || '');
      } else {
        setDescription('');
        setAmount('');
        setCategory('other');
        setTransactionType('expense');
        setRemarks('');
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
      isExpense: transactionType === 'expense',
      isSavings: transactionType === 'savings',
      remarks: remarks.trim() || undefined
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
            defaultValue={transactionType} 
            className="w-full" 
            value={transactionType}
            onValueChange={(val: 'expense' | 'income' | 'savings') => setTransactionType(val)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger 
                value="expense" 
                className={cn(
                  "flex items-center justify-center",
                  transactionType === 'expense' && "data-[state=active]:bg-red-100 data-[state=active]:text-red-600"
                )}
              >
                <MinusCircle className="h-4 w-4 mr-2" />
                Expense
              </TabsTrigger>
              <TabsTrigger 
                value="income"
                className={cn(
                  "flex items-center justify-center",
                  transactionType === 'income' && "data-[state=active]:bg-green-100 data-[state=active]:text-green-600"
                )}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Income
              </TabsTrigger>
              <TabsTrigger 
                value="savings"
                className={cn(
                  "flex items-center justify-center",
                  transactionType === 'savings' && "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600"
                )}
              >
                <PiggyBank className="h-4 w-4 mr-2" />
                Savings
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
          
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (optional)</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Any additional notes about this transaction..."
              className="resize-none h-20 neon-border glass-card text-white"
            />
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
