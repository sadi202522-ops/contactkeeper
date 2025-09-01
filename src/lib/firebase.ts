
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "contact-keeper-6fzw8",
  "appId": "1:571535988341:web:3e88fa17be51ee35b90a3c",
  "storageBucket": "contact-keeper-6fzw8.firebasestorage.app",
  "apiKey": "AIzaSyCfU8VNQyNiiQDnGt93NezgR5LtI2ukORA",
  "authDomain": "contact-keeper-6fzw8.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "571535988341"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
