import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { auth } from '@/firebase'; // Import auth from your firebase.ts file
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getAuth,
  User as FirebaseUser, // Alias Firebase User type
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Get Firestore instance
const db = getFirestore();

// Function to create user document if it doesn't exist
const createUserDocumentIfMissing = async (user: FirebaseUser) => {
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    try {
      // Create the user document with initial data
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email, // Or other relevant user data
        hiddenCategoryIds: [] // Initialize with an empty array
        // Add any other initial fields you need for a user
      });
      console.log("User document created for", user.uid);
    } catch (error) {
      console.error("Error creating user document:", error);
    }
  }
};

interface User {
  uid: string;
  email: string | null;
  // Add other user properties you might need from FirebaseUser
}

interface AuthContextProps {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loading: boolean; // Add a loading state
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Initialize loading to true

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => { // Made callback async
      // console.log('onAuthStateChanged triggered');
      if (firebaseUser) {
        // console.log('User authenticated. Setting currentUser:', firebaseUser);
        // Map FirebaseUser to your User interface
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          // Map other properties
        };

        setCurrentUser(user);
        await createUserDocumentIfMissing(firebaseUser); // Create document if missing on auth state change
      } else {
        setCurrentUser(null);
      }
      setLoading(false); // Set loading to false after checking auth state
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // createUserDocumentIfMissing is called in onAuthStateChanged, which is triggered by signInWithEmailAndPassword
       console.log('signInWithEmailAndPassword successful');
    } catch (error) {
      console.error("Error signing in:", error);
      throw error; // Re-throw for handling in components
    }
  };

  const logout = async () => {
    try {
       await signOut(auth);
    } catch (error) {
       console.error("Error logging out:", error);
       throw error; // Re-throw for handling in components
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // createUserDocumentIfMissing is called in onAuthStateChanged, which is triggered by createUserWithEmailAndPassword
    } catch (error) {
       console.error("Error registering user:", error);
       throw error; // Re-throw for handling in components
    }
  };

  const value: AuthContextProps = {
    currentUser,
    login,
    logout,
    register,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only when not loading */}
    </AuthContext.Provider>
  );
};
