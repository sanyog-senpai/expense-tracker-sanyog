import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { fadeIn, slideUp } from '@/lib/animations';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation for password match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Handle registration logic here
    console.log('Registering with:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/95 via-purple-900 to-gray-900 p-4 md:p-6 flex justify-center items-center">
      <motion.div
        variants={slideUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center text-white/70 hover:text-white mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>

        <Card className="bg-gray-800/80 border border-white/10 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center space-y-1 pb-3">
            <CardTitle className="text-2xl font-bold text-white">
              Create Account
            </CardTitle>
            <p className="text-sm text-white/70">
              Join Expense Tracker to manage your finances
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={fadeIn}>
                <Label htmlFor="username" className="text-white/80">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="cooluser123"
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-10 bg-gray-700/50 border-white/10 text-white focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/30"
                    required
                    minLength={3}
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Label htmlFor="email" className="text-white/80">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-gray-700/50 border-white/10 text-white focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/30"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Label htmlFor="password" className="text-white/80">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 bg-gray-700/50 border-white/10 text-white focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/30"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={fadeIn}>
                <Label htmlFor="confirmPassword" className="text-white/80">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 bg-gray-700/50 border-white/10 text-white focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                >
                  Create Account
                </Button>
              </motion.div>

              <motion.div 
                variants={fadeIn}
                className="text-center text-sm text-white/70 pt-2"
              >
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-purple-400 hover:text-purple-300 hover:underline"
                >
                  Sign in
                </Link>
              </motion.div>
            </form>
          </CardContent>
        </Card>

        <motion.div 
          variants={fadeIn}
          className="mt-6 text-center text-xs text-white/50"
        >
          Expense Tracker © {new Date().getFullYear()}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;