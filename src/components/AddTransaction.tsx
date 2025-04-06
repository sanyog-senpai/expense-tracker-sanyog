
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, ArrowDown, ArrowUp, PiggyBank, Calendar, Receipt, CircleDollarSign, FileText } from 'lucide-react';
import { Category, Transaction } from '@/context/TransactionContext';
import { useCategories } from '@/context/CategoryContext';
import { motion, AnimatePresence } from 'framer-motion';
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
    // Get current time in Nepal (Kathmandu timezone)
    const now = new Date();
    
    // Format the date string properly for Nepal time (UTC+05:45)
    const year = now.toLocaleString('en-US', { year: 'numeric', timeZone: 'Asia/Kathmandu' });
    const month = now.toLocaleString('en-US', { month: '2-digit', timeZone: 'Asia/Kathmandu' });
    const day = now.toLocaleString('en-US', { day: '2-digit', timeZone: 'Asia/Kathmandu' });
    const hours = now.toLocaleString('en-US', { hour: '2-digit', hour12: false, timeZone: 'Asia/Kathmandu' });
    const minutes = now.toLocaleString('en-US', { minute: '2-digit', timeZone: 'Asia/Kathmandu' });
    
    // Create the date-time string in ISO format
    const kathmandDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    
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
      setDate(kathmandDateTime);
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { 
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };

  const iconVariants = {
    hover: { 
      scale: 1.15, 
      rotate: [0, -10, 10, -5, 5, 0],
      transition: { duration: 0.5 }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-purple-dark border-white/10 p-0 max-w-lg mx-auto max-h-[90vh] overflow-hidden">
        <div className="relative overflow-hidden h-full">
          {/* Enhanced background effects */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-neon-purple/20 to-neon-blue/10 rounded-full filter blur-3xl opacity-30 animate-pulse-subtle"></div>
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-gradient-to-tr from-neon-pink/10 to-neon-purple/20 rounded-full filter blur-3xl opacity-20 animate-pulse-subtle"></div>
          <div className="absolute top-1/2 left-1/4 w-[100px] h-[100px] bg-white/5 rounded-full filter blur-3xl animate-float"></div>
          
          {/* Content */}
          <div className="p-5 md:p-6 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  {editTransaction ? "Edit Transaction" : "Add Transaction"}
                </DialogTitle>
              </motion.div>
              
              <motion.button
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors border border-white/10 hover:border-white/30"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-4 w-4 text-white/70" />
              </motion.button>
            </div>
            
            <ScrollArea className="h-[calc(90vh-120px)]">
              <motion.form 
                onSubmit={handleSubmit}
                className="space-y-5 md:space-y-6 pr-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <Label htmlFor="amount" className="text-white/70 mb-1.5 block text-xs">Amount</Label>
                    <div className="relative group">
                      <motion.div 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 group-hover:text-neon-purple transition-colors"
                        whileHover={iconVariants.hover}
                      >
                        <CircleDollarSign className="h-5 w-5" />
                      </motion.div>
                      <Input
                        id="amount"
                        type="number" 
                        inputMode="decimal"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-white/5 border-white/10 focus:border-neon-purple/50 text-white pl-10 h-12 rounded-xl hover:bg-white/8 transition-all focus:ring-2 focus:ring-neon-purple/30 focus:ring-offset-2 focus:ring-offset-purple-dark"
                        required
                      />
                      <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none group-hover:border-white/30 group-focus-within:border-neon-purple/50 transition-colors"></div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="text-white/70 mb-1.5 block text-xs">Category</Label>
                    <div className="relative group">
                      <Select
                        value={category}
                        onValueChange={(value) => setCategory(value as Category)}
                      >
                        <SelectTrigger 
                          id="category"
                          className="bg-white/5 border-white/10 text-white h-12 rounded-xl hover:bg-white/8 focus:ring-2 focus:ring-neon-purple/30 focus:ring-offset-2 focus:ring-offset-purple-dark transition-all group-hover:border-white/30 pl-10"
                        >
                          <motion.div 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 group-hover:text-neon-purple transition-colors"
                            whileHover={iconVariants.hover}
                          >
                            <FileText className="h-5 w-5" />
                          </motion.div>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-purple-dark border-white/10 rounded-xl backdrop-blur-xl">
                          {categories.map((cat) => (
                            <SelectItem 
                              key={cat} 
                              value={cat} 
                              className="text-white hover:bg-white/10 focus:bg-white/15 rounded-lg my-0.5"
                            >
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Label htmlFor="date" className="text-white/70 mb-1.5 block text-xs">Date & Time</Label>
                  <div className="relative group">
                    <motion.div 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 group-hover:text-neon-purple transition-colors"
                      whileHover={iconVariants.hover}
                    >
                      <Calendar className="h-5 w-5" />
                    </motion.div>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-white/5 border-white/10 focus:border-neon-purple/50 text-white h-12 rounded-xl hover:bg-white/8 transition-all focus:ring-2 focus:ring-neon-purple/30 focus:ring-offset-2 focus:ring-offset-purple-dark pl-10"
                      required
                    />
                    <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none group-hover:border-white/30 group-focus-within:border-neon-purple/50 transition-colors"></div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="col-span-2">
                  <Label htmlFor="description" className="text-white/70 mb-1.5 block text-xs">Description</Label>
                  <div className="relative group">
                    <motion.div 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 group-hover:text-neon-purple transition-colors"
                      whileHover={iconVariants.hover}
                    >
                      <Receipt className="h-5 w-5" />
                    </motion.div>
                    <Input
                      id="description"
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-white/5 border-white/10 focus:border-neon-purple/50 text-white h-12 rounded-xl hover:bg-white/8 transition-all focus:ring-2 focus:ring-neon-purple/30 focus:ring-offset-2 focus:ring-offset-purple-dark pl-10"
                      required
                    />
                    <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none group-hover:border-white/30 group-focus-within:border-neon-purple/50 transition-colors"></div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/5 to-transparent rounded-xl p-4 md:p-5 space-y-3 border border-white/10 hover:border-white/20 transition-colors">
                  <h4 className="text-xs font-medium text-white/80">Transaction Type</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setIsExpense(true); setIsSavings(false); }}
                    >
                      <div className={`rounded-xl border p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-lg ${
                        isExpense && !isSavings 
                          ? "border-red-500/50 bg-gradient-to-br from-red-500/20 to-red-600/5 shadow-[0_0_15px_rgba(239,68,68,0.15)]" 
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}>
                        <motion.div 
                          className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                            isExpense && !isSavings 
                              ? "bg-red-500/30" 
                              : "bg-white/10"
                          }`}
                          animate={isExpense && !isSavings ? { scale: [1, 1.1, 1], transition: { duration: 0.5 } } : {}}
                        >
                          <ArrowDown className={`h-5 w-5 ${isExpense && !isSavings ? "text-red-400" : "text-white/60"}`} />
                        </motion.div>
                        <span className={`text-xs font-medium ${isExpense && !isSavings ? "text-red-400" : "text-white/70"}`}>Expense</span>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setIsExpense(false); setIsSavings(false); }}
                    >
                      <div className={`rounded-xl border p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-lg ${
                        !isExpense && !isSavings 
                          ? "border-green-500/50 bg-gradient-to-br from-green-500/20 to-green-600/5 shadow-[0_0_15px_rgba(34,197,94,0.15)]" 
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}>
                        <motion.div 
                          className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                            !isExpense && !isSavings 
                              ? "bg-green-500/30" 
                              : "bg-white/10"
                          }`}
                          animate={!isExpense && !isSavings ? { scale: [1, 1.1, 1], transition: { duration: 0.5 } } : {}}
                        >
                          <ArrowUp className={`h-5 w-5 ${!isExpense && !isSavings ? "text-green-400" : "text-white/60"}`} />
                        </motion.div>
                        <span className={`text-xs font-medium ${!isExpense && !isSavings ? "text-green-400" : "text-white/70"}`}>Income</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 transition-all">
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
                  <div className="flex items-center">
                    <PiggyBank className={`h-4 w-4 mr-2 ${isSavings ? "text-blue-400" : "text-white/60"}`} />
                    <Label htmlFor="savings" className={`${isSavings ? "text-blue-400" : "text-white/70"} text-xs cursor-pointer`}>
                      Mark as Savings
                    </Label>
                  </div>
                </motion.div>
                
                <AnimatePresence>
                  {isSavings && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Label htmlFor="savingsPurpose" className="text-white/70 mb-1.5 block text-xs">Savings Purpose</Label>
                      <div className="relative group">
                        <motion.div 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400/70"
                          whileHover={iconVariants.hover}
                        >
                          <PiggyBank className="h-5 w-5" />
                        </motion.div>
                        <Input
                          id="savingsPurpose"
                          placeholder="e.g., Emergency Fund, Vacation"
                          value={savingsPurpose}
                          onChange={(e) => setSavingsPurpose(e.target.value)}
                          className="bg-blue-500/5 border-blue-500/20 focus:border-blue-400/50 text-white h-12 rounded-xl hover:bg-blue-500/10 transition-all focus:ring-2 focus:ring-blue-400/30 focus:ring-offset-2 focus:ring-offset-purple-dark pl-10"
                        />
                        <div className="absolute inset-0 border border-blue-500/20 rounded-xl pointer-events-none group-hover:border-blue-400/30 group-focus-within:border-blue-400/50 transition-colors"></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.div variants={itemVariants}>
                  <Label htmlFor="remarks" className="text-white/70 mb-1.5 block text-xs">Notes (Optional)</Label>
                  <Textarea
                    id="remarks"
                    placeholder="Add any additional notes"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-neon-purple/50 text-white min-h-[100px] rounded-xl resize-none hover:bg-white/8 transition-all focus:ring-2 focus:ring-neon-purple/30 focus:ring-offset-2 focus:ring-offset-purple-dark"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex justify-end gap-3 pt-2 pb-4">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="border-white/10 text-white/70 hover:bg-white/10 hover:text-white rounded-xl h-10 px-4"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.97 }}
                    className="relative overflow-hidden rounded-xl"
                  >
                    <Button
                      type="submit"
                      className={`rounded-xl h-10 px-5 shadow-lg ${
                        editTransaction 
                          ? "bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-purple/90 hover:to-neon-blue/90 shadow-[0_0_15px_rgba(162,105,255,0.4)]" 
                          : isSavings 
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-500/90 hover:to-blue-600/90 shadow-[0_0_15px_rgba(59,130,246,0.4)]" 
                            : isExpense 
                              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-500/90 hover:to-red-600/90 shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
                              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-500/90 hover:to-green-600/90 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                      } text-white relative z-10 overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-20 transition-opacity z-0"></div>
                      {editTransaction ? "Update" : "Add"} Transaction
                    </Button>
                    <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm opacity-0 group-hover:opacity-100 animate-shine"></div>
                  </motion.div>
                </motion.div>
              </motion.form>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransaction;
