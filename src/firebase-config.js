// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from '@firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBThoJqMEAGISaCEFaOnA0AqXkSQwVw_8c',
  authDomain: 'cabinet-neuro.firebaseapp.com',
  projectId: 'cabinet-neuro',
  storageBucket: 'cabinet-neuro.appspot.com',
  messagingSenderId: '326661608959',
  appId: '1:326661608959:web:38d7009a077d89ea7483ca',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
