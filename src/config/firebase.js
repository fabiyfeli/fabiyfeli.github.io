// Firebase Configuration for Wedding Website
// Domain: https://fabiyfeli.cl (Custom DNS)
// Repository: fabiyfeli/fabiyfeli.github.io
// These credentials are SAFE to be public - security is handled by Firebase Rules
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase project configuration
// Get these values from: Firebase Console > Project Settings > General > Your apps

const firebaseConfig = {
  apiKey: "AIzaSyDyBrDlghJzudSloB7U_Ackuq6ogDmnSxI",
  authDomain: "wedding-rsvp-431b9.firebaseapp.com",
  projectId: "wedding-rsvp-431b9",
  storageBucket: "wedding-rsvp-431b9.firebasestorage.app",
  messagingSenderId: "96255666324",
  appId: "1:96255666324:web:b35f37d8dabc86793c6c81"
};

// Initialize Firebase
let app;
let db;
let auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { app, db, auth };
