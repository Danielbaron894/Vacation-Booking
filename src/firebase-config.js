import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyBSYr49EOT8348QQ1DkEskO2v_saNBwbz0",
  authDomain: "vacationsappproject.firebaseapp.com",
  projectId: "vacationsappproject",
  storageBucket: "vacationsappproject.appspot.com",
  messagingSenderId: "1066503475195",
  appId: "1:1066503475195:web:255afc8771570c0e68455e",
  measurementId: "G-51XJK8Z5W0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);