// src/firebase-config.jsx
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAQUz7akHZbTXRDRxWk--z-HexHhsAOJ4s",
    authDomain: "image-uploader-b1e9c.firebaseapp.com",
    projectId: "image-uploader-b1e9c",
    storageBucket: "image-uploader-b1e9c.appspot.com",
    messagingSenderId: "222479930315",
    appId: "1:222479930315:web:13a98173705b4c5f5b9c4e",
    measurementId: "G-70BVVYX1DW"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log("Firebase has been initialized:", app);