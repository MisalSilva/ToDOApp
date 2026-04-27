import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVQoe84XB-ym5J-7-OX7ajCUEyNw53TrE",
  authDomain: "todoapp-75908.firebaseapp.com",
  projectId: "todoapp-75908",
  storageBucket: "todoapp-75908.firebasestorage.app",
  messagingSenderId: "14763246928",
  appId: "1:14763246928:web:c24967355b875f68f8d855",
  measurementId: "G-41101J4PQE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
