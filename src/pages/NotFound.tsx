import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import TransactionList from '@/components/TransactionList';
import AddTransaction from '@/components/AddTransaction';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, containerVariants } from '@/lib/pageTransitions';
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (

    <Layout >
      <motion.div
        initial="initial"
        animate="animate"
        variants={containerVariants}
        exit="exit"
      >
        <motion.div
          key="dashboard"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="mt-4"
        >
          <div className="h-dvh flex items-center justify-center mt-[-3.5rem]">
            <div className="text-center">
              <p className="text-xl text-gray-400 mb-4">Oops! You're Lost!</p>
              <h1 className="text-7xl text-gray-100 font-bold mb-8">404</h1>
              <a href="/" className="rounded-full h-8 md:h-10 px-3 py-3 md:px-4 text-xs md:text-sm bg-neon-purple hover:bg-neon-purple/90 shadow-[0_0_10px_rgba(162,105,255,0.3)] hover:shadow-[0_0_15px_rgba(162,105,255,0.5)]">
                Return to Home
              </a>
            </div>
          </div>
          <div className="my-6">
            <motion.h2
              className="text-xl font-semibold mt-8"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Recent Transactions */}
            </motion.h2>

          </div>
        </motion.div>

      </motion.div>
    </Layout>
  );
};

export default NotFound;
