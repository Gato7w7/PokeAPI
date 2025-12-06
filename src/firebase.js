// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAv6pYbtXuYLtQlA9kBsENER4D392F8io8",
  authDomain: "pokeapi-ee307.firebaseapp.com",
  projectId: "pokeapi-ee307",
  storageBucket: "pokeapi-ee307.firebasestorage.app",
  messagingSenderId: "672519689992",
  appId: "1:672519689992:web:6d112d6e778fac248ffebd",
  measurementId: "G-3D3GCMM0YY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
});

export const googleProvider = new GoogleAuthProvider();

export default app;