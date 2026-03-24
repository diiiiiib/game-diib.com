// ==========================================
// GAME DIIB - Firebase Configuration
// ⚠️  تحذير أمني: في الإنتاج، يجب إخفاء هذه المفاتيح باستخدام متغيرات البيئة
// ==========================================

// Firebase Configuration
export const firebaseConfig = {
    apiKey: "AIzaSyDNUd80AsJCBRAyRCSOV05-Xie51-diWz0",
    authDomain: "adiibme.firebaseapp.com",
    projectId: "adiibme",
    storageBucket: "adiibme.firebasestorage.app",
    messagingSenderId: "685514268799",
    appId: "1:685514268799:web:fa141113c767507d021f4a",
    measurementId: "G-CKYWMEZ9M8"
};

// Firebase Collections Names
export const COLLECTIONS = {
    USERS: 'users',
    GAMES: 'games',
    COMPETITIONS: 'competitions',
    RATINGS: 'ratings',
    COMMENTS: 'comments',
    NOTIFICATIONS: 'notifications',
    COMPETITION_PARTICIPANTS: 'competition_participants',
    MODELS_3D: 'models_3d',
    MODEL_COMMENTS: 'model_comments',
    MODEL_RATINGS: 'model_ratings',
    TRANSACTIONS: 'transactions',
    WITHDRAWALS: 'withdrawals',
    DEPOSITS: 'deposits',
    CHATS: 'chats',
    MESSAGES: 'messages'
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore, doc, collection, serverTimestamp, setDoc, getDoc, updateDoc, addDoc, deleteDoc, query, where, orderBy, limit, getDocs, arrayUnion, arrayRemove, increment, runTransaction } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL as getStorageDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Import additional Firebase Auth functions
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

// Helper function to get document reference
export const getDocRef = (collectionName, docId) => {
    return doc(db, collectionName, docId);
};

// Helper function to get collection reference
export const getCollectionRef = (collectionName) => {
    return collection(db, collectionName);
};

// Helper function to handle errors
export const handleFirebaseError = (error) => {
    console.error('Firebase Error:', error);
    const errorMessages = {
        'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
        'auth/invalid-email': 'البريد الإلكتروني غير صالح',
        'auth/weak-password': 'كلمة المرور ضعيفة جداً',
        'auth/user-not-found': 'المستخدم غير موجود',
        'auth/wrong-password': 'كلمة المرور غير صحيحة',
        'permission-denied': 'ليس لديك الصلاحية للقيام بهذا الإجراء',
        'not-found': 'المحتوى غير موجود',
        'already-exists': 'المحتوى موجود بالفعل'
    };
    return errorMessages[error.code] || error.message || 'حدث خطأ غير متوقع';
};

// Export Firebase services and helpers
export {
    doc,
    collection,
    serverTimestamp,
    setDoc,
    getDoc,
    updateDoc,
    ref,
    uploadBytes,
    getStorageDownloadURL,
    deleteObject,
    query,
    where,
    orderBy,
    limit,
    addDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove,
    increment,
    runTransaction,
    getDocs,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
};
