import { config } from 'dotenv';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const envPath = `.env.${process.env.NODE_ENV}`;
config({ path: envPath });

// Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };

const firebaseConfig = {
  apiKey: 'AIzaSyDzWBc377MBpRgFABwKnKi9gizxDWp7CIs',
  authDomain: 'civicbase-dev.firebaseapp.com',
  projectId: 'civicbase-dev',
  storageBucket: 'civicbase-dev.appspot.com',
  messagingSenderId: '631555217652',
  appId: '1:631555217652:web:edf79a24562672163666a1',
  measurementId: 'G-XPF5G6YYH5',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
