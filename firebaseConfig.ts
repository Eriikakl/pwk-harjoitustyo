
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLvJLK2VYBGUzwPtUCX9Y0lZWEtUpg3vg",
  authDomain: "pilvipalvelut-5a508.firebaseapp.com",
  projectId: "pilvipalvelut-5a508",
  storageBucket: "pilvipalvelut-5a508.firebasestorage.app",
  messagingSenderId: "359761328007",
  appId: "1:359761328007:web:1d7c73e88cd7a9486c4522"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default firebaseConfig;
export { db };