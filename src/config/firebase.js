import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCwzfGQXJh8OO_lxJ7vccUzYdRczMgdzQ8",
  authDomain: "indabaxvoting.firebaseapp.com",
  projectId: "indabaxvoting",
  storageBucket: "indabaxvoting.firebasestorage.app",
  messagingSenderId: "377766549788",
  appId: "1:377766549788:web:cee4394ec41e3037e342d9",
  measurementId: "G-VYYXVJBS5S"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;