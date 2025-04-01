// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMTNvQiAKlBfVt5S_uySdYqfUyrW5wRck",
  authDomain: "smart-chat-c4743.firebaseapp.com",
  projectId: "smart-chat-c4743",
  storageBucket: "smart-chat-c4743.firebasestorage.app",
  messagingSenderId: "896888138808",
  appId: "1:896888138808:web:84028ea92cc3e6f83acacd",
  measurementId: "G-EKJKZWM6HJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app)
const storage = getStorage(app)

export {db, auth, storage};
export default {db, auth, storage};