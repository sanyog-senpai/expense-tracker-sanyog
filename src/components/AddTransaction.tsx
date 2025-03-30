
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction, Category } from '@/context/TransactionContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, MinusCircle, PiggyBank, Calendar, Tag, DollarSign, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, slideUp, scaleIn } from '@/lib/animations';

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
  const [savingsPurpose, setSavingsPurpose] = useState('');
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
          setSavingsPurpose(editTransaction.savingsPurpose || '');
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
        setSavingsPurpose('');
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
    
    // Validate savings purpose if it's a savings transaction
    if (transactionType === 'savings' && !savingsPurpose.trim()) {
      setError('Please enter a purpose for your savings');
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
      savingsPurpose: transactionType === 'savings' ? savingsPurpose.trim() : undefined,
      remarks: remarks.trim() || undefined
    };
    
    onSave(transaction);
    onClose();
  };
  
  const getTabColor = (type: 'expense' | 'income' | 'savings') => {
    if (type === 'expense') return "data-[state=active]:bg-red-100/10 data-[state=active]:text-red-400";
    if (type === 'income') return "data-[state=active]:bg-green-100/10 data-[state=active]:text-green-400";
    return "data-[state=active]:bg-blue-100/10 data-[state=active]:text-blue-400";
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-purple-dark/95 border-neon-purple/30 text-white">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-5">
            <motion.div variants={fadeIn}>
              <Tabs 
                defaultValue={transactionType} 
                className="w-full" 
                value={transactionType}
                onValueChange={(val: 'expense' | 'income' | 'savings') => setTransactionType(val)}
              >
                <TabsList className="grid w-full grid-cols-3 bg-black/20 p-1">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <TabsTrigger 
                      value="expense" 
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-md",
                        getTabColor('expense')
                      )}
                    >
                      <MinusCircle className="h-4 w-4" />
                      <span>Expense</span>
                    </TabsTrigger>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <TabsTrigger 
                      value="income"
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-md",
                        getTabColor('income')
                      )}
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Income</span>
                    </TabsTrigger>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <TabsTrigger 
                      value="savings"
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-md",
                        getTabColor('savings')
                      )}
                    >
                      <PiggyBank className="h-4 w-4" />
                      <span>Savings</span>
                    </TabsTrigger>
                  </motion.div>
                </TabsList>
              </Tabs>
            </motion.div>
            
            <div className="grid gap-4">
              <motion.div 
                className="space-y-2"
                variants={fadeIn}
                custom={1}
                initial="initial"
                animate="animate"
              >
                <Label htmlFor="description" className="text-white/80 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-white/60" />
                  Description
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What was this transaction for?"
                  className="bg-white/5 border-white/10 focus-visible:ring-neon-purple/30 text-white placeholder:text-white/30"
                />
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                variants={fadeIn}
                custom={2}
                initial="initial"
                animate="animate"
              >
                <Label htmlFor="amount" className="text-white/80 flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5 text-white/60" />
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className="bg-white/5 border-white/10 focus-visible:ring-neon-purple/30 text-white placeholder:text-white/30"
                />
              </motion.div>
              
              <AnimatePresence>
                {transactionType === 'savings' && (
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="savingsPurpose" className="text-white/80 flex items-center gap-2">
                      <PiggyBank className="h-3.5 w-3.5 text-white/60" />
                      Savings Purpose
                    </Label>
                    <Input
                      id="savingsPurpose"
                      value={savingsPurpose}
                      onChange={(e) => setSavingsPurpose(e.target.value)}
                      placeholder="What are you saving for?"
                      className="bg-white/5 border-white/10 focus-visible:ring-neon-purple/30 text-white placeholder:text-white/30"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div 
                className="space-y-2"
                variants={fadeIn}
                custom={3}
                initial="initial"
                animate="animate"
              >
                <Label htmlFor="category" className="text-white/80 flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-white/60" />
                  Category
                </Label>
                <Select 
                  value={category} 
                  onValueChange={(value: Category) => setCategory(value)}
                >
                  <SelectTrigger 
                    id="category"
                    className="bg-white/5 border-white/10 focus:ring-neon-purple/30 text-white"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-dark border-white/10">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-white focus:bg-white/10 focus:text-white">
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                variants={fadeIn}
                custom={4}
                initial="initial"
                animate="animate"
              >
                <Label htmlFor="remarks" className="text-white/80 flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-white/60" />
                  Remarks (optional)
                </Label>
                <Textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Any additional notes about this transaction..."
                  className="resize-none h-16 bg-white/5 border-white/10 focus-visible:ring-neon-purple/30 text-white placeholder:text-white/30"
                />
              </motion.div>
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-2 rounded-md"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <DialogFooter className="flex gap-2 sm:gap-0">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
              >
                Cancel
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button 
                onClick={handleSave}
                className={cn(
                  "text-white",
                  transactionType === 'expense' && "bg-red-500 hover:bg-red-600",
                  transactionType === 'income' && "bg-green-500 hover:bg-green-600",
                  transactionType === 'savings' && "bg-blue-500 hover:bg-blue-600"
                )}
              >
                {editTransaction ? 'Update' : 'Save'} Transaction
              </Button>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransaction;
