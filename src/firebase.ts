import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDu1VwVrmEahR9WguyLxvYEv_On0yd0FAA",
  authDomain: "expense-tracker-95148.firebaseapp.com",
  projectId: "expense-tracker-95148",
  storageBucket: "expense-tracker-95148.firebasestorage.app",
  messagingSenderId: "470848464750",
  appId: "1:470848464750:web:74e7dc540284574b8a037f",
  measurementId: "G-JSPG08TS86"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };