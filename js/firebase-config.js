// Firebase Configuration for Pantukan Tourism
const firebaseConfig = {
    apiKey: "AIzaSyABHIYy8Sutd8NYVbmQsngrdznuOgKG0-U",
    authDomain: "tourism-gaming-pantukan.firebaseapp.com",
    projectId: "tourism-gaming-pantukan",
    storageBucket: "tourism-gaming-pantukan.firebasestorage.app",
    messagingSenderId: "53272952637",
    appId: "1:53272952637:web:30dbc4bed9814df3d44f54",
    measurementId: "G-YR8KEGL6QW"
};

// We will use the Firebase Modular SDK via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, query, where, deleteDoc, onSnapshot, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Enable Offline Persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn('Persistence failed: Multiple tabs open');
    } else if (err.code == 'unimplemented') {
        console.warn('Persistence failed: Browser not supported');
    }
});

// Export for use in other files
export { db, auth, doc, setDoc, getDoc, collection, addDoc, getDocs, query, where, deleteDoc, onSnapshot };
