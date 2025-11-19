// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// ⬇️ Replace this with YOUR Firebase config from the console
const firebaseConfig = {
  apiKey: "AIzaSyBAKxq7rFg7Ab-pzgHjMFcg2ptCUiz5zdY",
  authDomain: "hymnconnectapp.firebaseapp.com",
  databaseURL: "https://hymnconnectapp-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hymnconnectapp",
  storageBucket: "hymnconnectapp.firebasestorage.app",
  messagingSenderId: "742323682436",
  appId: "1:742323682436:web:fead7d5c5d3999d22a96d1",
  measurementId: "G-356C2P87BC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Realtime Database instance
export const db = getDatabase(app);