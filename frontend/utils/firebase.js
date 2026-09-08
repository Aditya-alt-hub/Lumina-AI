// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "multi-ai-2e3d0.firebaseapp.com",
  projectId: "multi-ai-2e3d0",
  storageBucket: "multi-ai-2e3d0.firebasestorage.app",
  messagingSenderId: "891455866920",
  appId: "1:891455866920:web:e437b1813effa0b8694d1d",
  measurementId: "G-LSKMNTRTXY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth=getAuth(app);

export const googleProvider=new GoogleAuthProvider();

// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     authDomain: "multi-ai-2e3d0.firebaseapp.com",
//     projectId: "multi-ai-2e3d0",
//     storageBucket: "multi-ai-2e3d0.firebasestorage.app",
//     messagingSenderId: "891455866920",
//     appId: "1:891455866920:web:e437b1813effa0b8694d1d",
//     measurementId: "G-LSKMNTRTXY"
// };

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);

// export const googleProvider = new GoogleAuthProvider();

// googleProvider.setCustomParameters({
//     prompt: "select_account"
// });