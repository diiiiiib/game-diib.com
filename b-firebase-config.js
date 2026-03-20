// ==========================================
// GAME DIIB - Firebase Configuration
// ==========================================

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDNUd80AsJCBRAyRCSOV05-Xie51-diWz0",
    authDomain: "adiibme.firebaseapp.com",
    projectId: "adiibme",
    storageBucket: "adiibme.firebasestorage.app",
    messagingSenderId: "685514268799",
    appId: "1:685514268799:web:fa141113c767507d021f4a",
    measurementId: "G-CKYWMEZ9M8"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore, doc, collection, serverTimestamp, setDoc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL as getStorageDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Firebase Collections Names
const COLLECTIONS = {
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
    DEPOSITS: 'deposits'
};

// Helper function to get document reference
const getDocRef = (collectionName, docId) => {
    return doc(db, collectionName, docId);
};

// Helper function to get collection reference
const getCollectionRef = (collectionName) => {
    return collection(db, collectionName);
};

// Helper function to handle errors
const handleFirebaseError = (error) => {
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
    auth,
    db,
    storage,
    analytics,
    COLLECTIONS,
    getDocRef,
    getCollectionRef,
    handleFirebaseError,
    doc,
    collection,
    serverTimestamp,
    setDoc,
    getDoc,
    updateDoc,
    getStorage,
    ref as storageRef,
    uploadBytes,
    getStorageDownloadURL
};
