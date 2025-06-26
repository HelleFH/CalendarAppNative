import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// DO NOT IMPORT getAnalytics at the top level
// import { getAnalytics } from 'firebase/analytics'; ❌

const firebaseConfig = {
  apiKey: 'AIzaSyCifDD5O_xjzLJdBxgYSB0JfRXZ2FqpKlQ',
  authDomain: 'plantcalendarapp.firebaseapp.com',
  projectId: 'plantcalendarapp',
  storageBucket: 'plantcalendarapp.appspot.com',
  messagingSenderId: '223096754951',
  appId: '1:223096754951:web:88766f0bdb23361c17aba2',
  measurementId: 'G-BYT8XJHLT9',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Only load analytics in the browser
if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ getAnalytics }) => {
    getAnalytics(app);
  });
}

export { auth };
