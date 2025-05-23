import React from 'react';
import { User, Mail, Calendar, Edit, Settings, LogOut, PieChart, Wallet, Tag, ChevronLeft, BarChart, CreditCard, TrendingUp, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const navigate = useNavigate();

  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    joinDate: "Joined March 2023",
    avatar: "/path-to-avatar.jpg",
    stats: {
      transactions: 142,
      categories: 8,
      balance: 12500,
      savings: 3500,
      monthlySpend: 4200,
      income: 8700,
      goals: 3
    }
  };

  const stats = [
    { icon: <PieChart className="h-4 w-4" />, title: "Transactions", value: userData.stats.transactions, change: `${Math.floor(userData.stats.transactions/30)}/month`, color: "text-blue-400" },
    { icon: <Tag className="h-4 w-4" />, title: "Categories", value: userData.stats.categories, change: "Food", color: "text-yellow-400" },
  ];

  const profileActions = [
    {
      icon: <Edit className="h-4 w-4" />,
      label: "Edit Profile",
      action: () => navigate('/profile/edit'),
      variant: "outline" // Add the variant here
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: "Settings",
      action: () => navigate('/settings'),
      variant: "outline" // Add the variant here
    },
    // Add other actions with their variants
  ];


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-purple-dark to-purple-darker p-4 md:p-6"
    >
      <div className="max-w-6xl mx-auto">
      <Button
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 mb-6"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        {/* Compact Profile Header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex items-center space-x-4 mb-6"
        >
          <Avatar className="h-14 w-14 border-2 border-neon-purple/30">
            <AvatarImage src={userData.avatar} />
            <AvatarFallback className="bg-white/10 text-xl">
              {userData.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-white">{userData.name}</h1>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/70">
              <span className="flex items-center">
                <Mail className="h-3 w-3 mr-1" /> {userData.email}
              </span>
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" /> {userData.joinDate}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Compact Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm h-full p-3">
                <CardHeader className="p-0 mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-md bg-white/10 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <CardTitle className="text-xs font-medium text-white/80">
                      {stat.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                </CardContent>
                <CardFooter className="p-0 mt-1 text-[10px] text-white/50">
                  {stat.change}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Compact Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {profileActions.map((action, index) => (
            <Button
              key={index}
              variant={"outline"}
              size="sm"
              className={`h-10 text-sm ${
                action.variant === "destructive" 
                  ? "border-red-500/30 text-red-400 hover:bg-red-500/10" 
                  : "border-white/10 text-white hover:bg-white/10 hover:text-neon-purple"
              }`}
              onClick={action.action}
            >
              <span className="mr-2">{action.icon}</span>
              {action.label}
            </Button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;