// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {

 apiKey: "AIzaSyAPMTs5tROpZ2L8Zsz1JSleUzAa4AOOFFQ",

  authDomain: "backend-web-38f25.firebaseapp.com",

  projectId: "backend-web-38f25",

  storageBucket: "backend-web-38f25.appspot.com",

  messagingSenderId: "937809457219",

  appId: "1:937809457219:web:ad3fb3594e9f67fdc9a4f6",

  measurementId: "G-G7LKVNKMCC"


};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;
