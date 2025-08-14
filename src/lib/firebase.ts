// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB69I8jFRazBAgt7ktXl3KiBz_IAeFWqAw",
  authDomain: "adobe-of-homes.firebaseapp.com",
  databaseURL: "https://adobe-of-homes-default-rtdb.firebaseio.com",
  projectId: "adobe-of-homes",
  storageBucket: "adobe-of-homes.firebasestorage.app",
  messagingSenderId: "787532865176",
  appId: "1:787532865176:web:03fb16c1b84894a59efaed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
// Use long-polling for Firestore to avoid network/proxy/ad-block issues in some environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);

export default app; 