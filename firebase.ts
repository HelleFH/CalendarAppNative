import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; 

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyCifDD5O_xjzLJdBxgYSB0JfRXZ2FqpKlQ',
  authDomain: 'plantcalendarapp.firebaseapp.com',
  projectId: 'plantcalendarapp',
  storageBucket: 'plantcalendarapp.appspot.com',
  messagingSenderId: '223096754951',
  appId: '1:223096754951:web:88766f0bdb23361c17aba2',
  measurementId: 'G-BYT8XJHLT9',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);

// Firestore
const db = getFirestore(app); // ✅ create Firestore instance

// Only load analytics in the browser
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
  import('firebase/analytics')
    .then(({ getAnalytics }) => {
      try {
        getAnalytics(app);
      } catch {
        console.warn('Analytics disabled in test env');
      }
    })
    .catch(() => {});
}

// ✅ Export both auth and db
export { auth, db };
