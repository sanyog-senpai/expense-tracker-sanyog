import React, { useState } from 'react';
import { PlusCircle,Grid, ArrowUpDown, CircleUserRound, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from "@/components/ui/drawer";
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onAddClick: () => void;
  onFilterClick?: () => void;
  className?: string;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  onAddClick,
  onFilterClick,
  className,
  title = "Expense Tracker"
}) => {
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <User className="h-5 w-5" />,
      label: "Profile",
      action: () => navigate('/profile')
    },
    {
      icon: <Grid className="h-5 w-5" />,
      label: "Categories",
      action: () => navigate('/categories')
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      action: () => navigate('/settings')
    },
    // {
    //   icon: <LogOut className="h-5 w-5" />,
    //   label: "Sign Out",
    //   action: () => navigate('/logout')
    // }
  ];

  return (
    <motion.header
      className={cn('flex items-center justify-between py-2 md:py-4 w-full', className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="flex flex-col items-start"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-xs md:text-sm text-muted-foreground">Track your finances</p>
      </motion.div>

      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {onFilterClick && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={onFilterClick}
              className="rounded-full h-8 w-8 md:h-10 md:w-10 bg-white/10 hover:bg-white/20 border-white/20"
            >
              <ArrowUpDown className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </motion.div>
        )}
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                className="rounded-full h-10 w-10 p-0 bg-neon-purple hover:bg-neon-purple/90 shadow-[0_0_10px_rgba(162,105,255,0.3)] hover:shadow-[0_0_15px_rgba(162,105,255,0.5)]"
              >
                <CircleUserRound className="h-5 w-5" />
              </Button>
              
            </DrawerTrigger>
            <DrawerContent className="bg-gradient-to-b from-purple-dark to-purple-darker border-none">
              <DrawerHeader className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neon-purple/20 mb-4">
                  <CircleUserRound className="h-6 w-6 text-neon-purple" />
                </div>
                <DrawerTitle className="text-white">User Menu</DrawerTitle>
                <DrawerDescription className="text-white/70">
                  Manage your account
                </DrawerDescription>
              </DrawerHeader>
              
              <div className="p-4 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => {
                        item.action();
                        setIsDrawerOpen(false);
                      }}
                      className="flex w-full items-center space-x-3 rounded-lg p-3 text-left transition-all hover:bg-white/10"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                        {item.icon}
                      </div>
                      <span className="text-white">{item.label}</span>
                    </button>
                  </motion.div>
                ))}
              </div>
              
              <div className="p-4 pt-0">
                <Button
                  variant="outline"
                  className="w-full border-white/20 bg-transparent text-white hover:bg-white/10"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Close
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        </motion.div>
      </motion.div>
    </motion.header>
  );
};

export default Header;