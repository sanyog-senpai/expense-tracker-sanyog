
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, ArrowDown, ArrowUp, PiggyBank } from 'lucide-react';
import { Category, Transaction } from '@/context/TransactionContext';
import { useCategories } from '@/context/CategoryContext';
import { motion } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  editTransaction?: Transaction;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editTransaction 
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [date, setDate] = useState('');
  const [isExpense, setIsExpense] = useState(true);
  const [isSavings, setIsSavings] = useState(false);
  const [savingsPurpose, setSavingsPurpose] = useState('');
  const [remarks, setRemarks] = useState('');
  const { categories } = useCategories();
  
  // Reset form and set default values when modal opens
  useEffect(() => {
    // Set current date and time as default (Nepal Standard Time - UTC+05:45)
    const now = new Date();
    // Adjust for Nepal timezone (UTC+05:45)
    const nepalOffset = 345; // 5 hours and 45 minutes in minutes
    const userOffset = now.getTimezoneOffset(); // User's timezone offset in minutes
    const nepalTime = new Date(now.getTime() + (nepalOffset + userOffset) * 60 * 1000);
    const currentDateTime = nepalTime.toISOString().slice(0, 16);
    
    if (editTransaction) {
      setDescription(editTransaction.description);
      setAmount(editTransaction.amount.toString());
      setCategory(editTransaction.category);
      setDate(editTransaction.date.slice(0, 16));
      setIsExpense(editTransaction.isExpense);
      setIsSavings(editTransaction.isSavings || false);
      setSavingsPurpose(editTransaction.savingsPurpose || '');
      setRemarks(editTransaction.remarks || '');
    } else {
      setDescription('');
      setAmount('');
      setCategory('food');
      setDate(currentDateTime);
      setIsExpense(true);
      setIsSavings(false);
      setSavingsPurpose('');
      setRemarks('');
    }
  }, [editTransaction, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData: Omit<Transaction, 'id'> = {
      amount: parseFloat(amount) || 0,
      description,
      date,
      category,
      isExpense,
      isSavings,
      savingsPurpose,
      remarks
    };
    
    onSave(transactionData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-purple-dark border-white/10 p-0 max-w-lg mx-auto max-h-[90vh] overflow-hidden">
        <div className="relative overflow-hidden h-full">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-blue/10 rounded-full filter blur-3xl opacity-20"></div>
          
          {/* Content */}
          <div className="p-5 md:p-6 relative z-10">
            <div className="flex items-center justify-between mb-5">
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {editTransaction ? "Edit Transaction" : "Add Transaction"}
              </DialogTitle>
              
              <motion.button
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-4 w-4 text-white/70" />
              </motion.button>
            </div>
            
            <ScrollArea className="h-[calc(90vh-120px)]">
              <motion.form 
                onSubmit={handleSubmit}
                className="space-y-4 md:space-y-5 pr-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label htmlFor="amount" className="text-white/70 mb-1.5 block text-xs">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">रु</span>
                      <Input
                        id="amount"
                        type="number" 
                        inputMode="decimal"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-white/5 border-white/10 focus:border-neon-purple/50 text-white pl-8 h-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-white/70 mb-1.5 block text-xs">Category</Label>
                    <Select
                      value={category}
                      onValueChange={(value) => setCategory(value as any)}
                    >
                      <SelectTrigger 
                        id="category"
                        className="bg-white/5 border-white/10 text-white h-10 focus:ring-neon-purple/20 focus:ring-offset-0"
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-purple-dark border-white/10">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="date" className="text-white/70 mb-1.5 block text-xs">Date & Time</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-neon-purple/50 text-white h-10"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description" className="text-white/70 mb-1.5 block text-xs">Description</Label>
                  <Input
                    id="description"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-neon-purple/50 text-white h-10"
                    required
                  />
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 md:p-4 space-y-2">
                  <h4 className="text-xs font-medium text-white/80">Transaction Type</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setIsExpense(true); setIsSavings(false); }}
                    >
                      <div className={`rounded-lg border p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isExpense && !isSavings 
                          ? "border-red-500/50 bg-red-500/10" 
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}>
                        <ArrowDown className={`h-6 w-6 mb-1 ${isExpense && !isSavings ? "text-red-400" : "text-white/60"}`} />
                        <span className={`text-xs font-medium ${isExpense && !isSavings ? "text-red-400" : "text-white/70"}`}>Expense</span>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setIsExpense(false); setIsSavings(false); }}
                    >
                      <div className={`rounded-lg border p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        !isExpense && !isSavings 
                          ? "border-green-500/50 bg-green-500/10" 
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}>
                        <ArrowUp className={`h-6 w-6 mb-1 ${!isExpense && !isSavings ? "text-green-400" : "text-white/60"}`} />
                        <span className={`text-xs font-medium ${!isExpense && !isSavings ? "text-green-400" : "text-white/70"}`}>Income</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="savings"
                    checked={isSavings}
                    onCheckedChange={(checked) => {
                      setIsSavings(checked);
                      if (checked) {
                        setIsExpense(true);
                        if (category !== 'savings') {
                          setCategory('savings');
                        }
                      }
                    }}
                    className="data-[state=checked]:bg-blue-500"
                  />
                  <Label htmlFor="savings" className="text-white/70 text-xs cursor-pointer">Mark as Savings</Label>
                </div>
                
                {isSavings && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="savingsPurpose" className="text-white/70 mb-1.5 block text-xs">Savings Purpose</Label>
                    <Input
                      id="savingsPurpose"
                      placeholder="e.g., Emergency Fund, Vacation"
                      value={savingsPurpose}
                      onChange={(e) => setSavingsPurpose(e.target.value)}
                      className="bg-white/5 border-white/10 focus:border-neon-purple/50 text-white h-10"
                    />
                  </motion.div>
                )}
                
                <div>
                  <Label htmlFor="remarks" className="text-white/70 mb-1.5 block text-xs">Notes (Optional)</Label>
                  <Textarea
                    id="remarks"
                    placeholder="Add any additional notes"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-neon-purple/50 text-white min-h-[80px]"
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-2 pb-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className={`${
                        editTransaction 
                          ? "bg-neon-purple hover:bg-neon-purple/90" 
                          : isSavings 
                            ? "bg-blue-500 hover:bg-blue-600" 
                            : isExpense 
                              ? "bg-red-500 hover:bg-red-600" 
                              : "bg-green-500 hover:bg-green-600"
                      } text-white`}
                    >
                      {editTransaction ? "Update" : "Add"} Transaction
                    </Button>
                  </motion.div>
                </div>
              </motion.form>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransaction;
