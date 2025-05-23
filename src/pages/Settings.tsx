import React from 'react';
import { Settings, User, Bell, Lock, LogOut, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const navigate = useNavigate();

  const settingsSections = [
    {
      title: "Account",
      icon: <User className="h-5 w-5 text-neon-purple" />,
      items: [
        {
          title: "Profile Information",
          description: "Update your name, email, and profile picture",
          action: () => navigate('/profile/edit')
        },
        {
          title: "Change Password",
          description: "Update your login password",
          action: () => navigate('/change-password')
        }
      ]
    },
    {
      title: "Preferences",
      icon: <Settings className="h-5 w-5 text-neon-purple" />,
      items: [
        {
          title: "Appearance",
          description: "Customize the look and feel",
          action: () => navigate('/settings/appearance')
        },
        {
          title: "Currency",
          description: "Set your preferred currency",
          action: () => navigate('/settings/currency')
        }
      ]
    },
    {
      title: "Notifications",
      icon: <Bell className="h-5 w-5 text-neon-purple" />,
      items: [
        {
          title: "Email Notifications",
          description: "Manage email alerts",
          component: <Switch className="data-[state=checked]:bg-neon-purple" />
        },
        {
          title: "Push Notifications",
          description: "Control app notifications",
          component: <Switch className="data-[state=checked]:bg-neon-purple" />
        }
      ]
    },
    {
      title: "Security",
      icon: <Lock className="h-5 w-5 text-neon-purple" />,
      items: [
        {
          title: "Two-Factor Authentication",
          description: "Add an extra layer of security",
          action: () => navigate('/settings/2fa')
        },
        {
          title: "Login Activity",
          description: "View recent account access",
          action: () => navigate('/settings/activity')
        }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-purple-dark to-purple-darker p-4 md:p-6"
    >
      <Button
        variant="outline"
        className="bg-white/5 border-white/10 text-white hover:bg-white/10 mb-6"
        onClick={() => navigate('/')}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
            <p className="text-white/70">Manage your account preferences</p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {settingsSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader className="border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    {section.icon}
                    <div>
                      <CardTitle className="text-white">{section.title}</CardTitle>
                      <CardDescription className="text-white/70">
                        Configure your {section.title.toLowerCase()} settings
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-white/10">
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={item.action}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{item.title}</h3>
                            <p className="text-white/60 text-sm">{item.description}</p>
                          </div>
                          {item.component ? (
                            item.component
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-neon-purple hover:text-neon-purple/80"
                            >
                              Manage
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="pt-4"
          >
            <Button
              variant="outline"
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              onClick={() => navigate('/logout')}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;