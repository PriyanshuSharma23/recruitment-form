// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDyo6bKYZNzGA-OAczB4Ck6I0qkOAoumeQ",
  authDomain: "socities-registration.firebaseapp.com",
  projectId: "socities-registration",
  storageBucket: "socities-registration.appspot.com",
  messagingSenderId: "421577753311",
  appId: "1:421577753311:web:4619645f88dd051cf11f6a",
  measurementId: "G-YFCZ9C4QMK",
};

// // Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
