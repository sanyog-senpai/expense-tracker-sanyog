
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTransactions } from '@/context/TransactionContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { formatDate, formatTime, formatCurrency, getCategoryIcon, getCategoryColor } from '@/utils/dateUtils';
import { motion } from 'framer-motion';
import { ChevronLeft, Edit, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from '@/components/ui/separator';
import { fadeIn } from '@/lib/animations';
import { useToast } from '@/components/ui/use-toast';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { state, deleteTransaction } = useTransactions();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  
  const transaction = state.transactions.find(t => t.id === id);
  
  if (!transaction) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h1 className="text-2xl font-bold text-white mb-4">Transaction not found</h1>
          <Button asChild>
            <Link to="/">Go Back</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const handleDelete = () => {
    deleteTransaction(transaction.id);
    toast({
      title: "Transaction deleted",
      description: "The transaction has been successfully deleted.",
    });
    window.history.back();
  };
  
  const categoryClass = getCategoryColor(transaction.category);
  const categoryIcon = getCategoryIcon(transaction.category);
  
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="container max-w-md mx-auto px-4 py-8"
      >
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.history.back()}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <motion.div
          variants={fadeIn}
          className="glass-card neon-border p-6 rounded-xl"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{transaction.description}</h1>
              <p className="text-white/60 text-sm">
                {formatDate(transaction.date)} at {formatTime(transaction.date)}
              </p>
            </div>
            
            <div className={`${categoryClass} w-10 h-10 rounded-full flex items-center justify-center text-lg`}>
              {categoryIcon}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className={`text-3xl font-bold ${
              transaction.isExpense 
                ? transaction.isSavings 
                  ? 'text-blue-400' 
                  : 'text-red-400' 
                : 'text-green-400'
            }`}>
              {transaction.isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
            </h2>
            <p className="text-white/60 text-sm mt-1 capitalize">
              {transaction.category} {transaction.isSavings && '• Savings'}
            </p>
          </div>
          
          <Separator className="bg-white/10 my-5" />
          
          {transaction.isSavings && transaction.savingsPurpose && (
            <div className="mb-5">
              <h3 className="text-sm font-medium text-white/70 mb-1">Savings Purpose</h3>
              <p className="text-white bg-white/5 p-3 rounded-lg text-sm">{transaction.savingsPurpose}</p>
            </div>
          )}
          
          {transaction.remarks && (
            <div className="mb-5">
              <h3 className="text-sm font-medium text-white/70 mb-1">Notes</h3>
              <p className="text-white bg-white/5 p-3 rounded-lg text-sm">{transaction.remarks}</p>
            </div>
          )}
          
          <div className="flex space-x-3 mt-8">
            <Button 
              variant="outline" 
              className="flex-1 border-white/10 text-white hover:bg-white/10"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="mr-2 h-4 w-4 text-red-400" />
              Delete
            </Button>
            <Button 
              asChild
              className="flex-1 bg-neon-purple hover:bg-neon-purple/90"
            >
              <Link to={`/transaction/edit/${transaction.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-purple-dark border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white border-white/10 hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default TransactionDetail;
