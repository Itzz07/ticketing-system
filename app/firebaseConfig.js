import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCPazYNaFZT1IqWlfQhKCeSyDYmqiqlUs",
  authDomain: "testing-5e7c1.firebaseapp.com",
  projectId: "testing-5e7c1",
  storageBucket: "testing-5e7c1.appspot.com",
  messagingSenderId: "717468538843",
  appId: "1:717468538843:web:131fcfb8fb5a159e40b9fe",
  measurementId: "G-GY4KTWG0R7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firebase Firestore (or Realtime Database)
const db = getFirestore(app);

// Export the initialized Firebase app, authentication, and Firestore database as an object
const firebase = { app, db, auth };

export default firebase;
