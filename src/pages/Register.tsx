import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { Lock, Mail, Eye, EyeOff, User, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '', // Firebase Auth does not directly support username, but you can store it separately
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrorMessage('');
    setShake(false);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setShake(true);
      setErrorMessage("Please fill in all fields.");

      setTimeout(() => setShake(false), 500);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setErrorMessage("Passwords do not match.");

      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await register(formData.email, formData.password);
      const user = userCredential.user; // Get the user object

      // Save user data to Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        username: formData.username,
        email: user.email,
        createdAt: new Date(),
      });
      setIsLoading(false);
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

      // You might want to save the username to Firestore here after successful registration
    } catch (error: any) {
      console.error('Register failed:', error);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setErrorMessage(error.message || 'Registration failed. Please try again.');

      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email address is already in use.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('The password is too weak. Please choose a stronger password.');
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }

      console.error('Registration failed:', error); // Log the full error object

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/95 via-purple-900 to-gray-900 p-4 md:p-6 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <motion.div
          animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-800/80 mt-4 border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden">
            {/* Animated header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-white">
                  Create Account
                </CardTitle>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-white/70 mt-1"
                >
                  Join Expense Tracker to manage your finances
                </motion.p>
              </CardHeader>
            </motion.div>

            <CardContent>
              {errorMessage && (
                <p className="text-red-500 text-center text-sm mb-4">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 text-center text-sm mb-4">
                  {successMessage}
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Field - Note: Firebase Auth doesn't directly support username */}
                {/* You would typically store this in a database like Firestore */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="username" className="text-white/80 block mb-2">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter Username"
                      value={formData.username}
                      onChange={handleChange}
                      className="pl-10 bg-gray-700/50 border-white/10 text-white focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/30 h-11"
                      required
                      minLength={3}
                    />
                  </div>
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Label htmlFor="email" className="text-white/80 block mb-2">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 bg-gray-700/50 border-white/10 text-white focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/30 h-11"
                      required
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="password" className="text-white/80 block mb-2">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 bg-gray-700/50 border-white/10 text-white focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/30 h-11"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={showPassword ? "visible" : "hidden"}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  </div>
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Label htmlFor="confirmPassword" className="text-white/80 block mb-2">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 bg-gray-700/50 border-white/10 text-white focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/30 h-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={showConfirmPassword ? "visible" : "hidden"}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-1"
                >
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors h-11"
                    disabled={isLoading}
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center"
                        >
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Creating account...
                        </motion.span>
                      ) : (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center"
                        >
                          Create Account <ArrowRight className="h-4 w-4 ml-2" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>

                {/* Sign In Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-sm text-white/70 pt-3"
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

            {/* Footer */}
          </Card>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="px-6 pb-4 mt-6 text-center text-xs text-white/50"
          >
            Expense Tracker © {new Date().getFullYear()}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
