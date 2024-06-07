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
  measurementId: "G-GY4KTWG0R7"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyA26NkMNZINJhiWAecwitVO7vKQbWhBKJk",
//   authDomain: "frontier-finance-zambia.firebaseapp.com",
//   projectId: "frontier-finance-zambia",
//   storageBucket: "frontier-finance-zambia.appspot.com",
//   messagingSenderId: "185041510818",
//   appId: "1:185041510818:web:db01be2007c26fea8d52fb",
//   measurementId: "G-YRVF1SMJGE",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firebase Firestore (or Realtime Database)
 const db = getFirestore(app);



export default { app, db, auth };