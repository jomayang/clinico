// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCbOdssJzLaRQvuFeGZJFem_aCOi69iVsE',
  authDomain: 'clinicoapp-3717c.firebaseapp.com',
  projectId: 'clinicoapp-3717c',
  storageBucket: 'clinicoapp-3717c.appspot.com',
  messagingSenderId: '351314037625',
  appId: '1:351314037625:web:0ba1e4810305c274f6bda8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
