// ==========================================
// GAME DIIB - Authentication System
// ==========================================

// Import Firebase services
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    sendEmailVerification,
    sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

import {
    serverTimestamp,
    setDoc,
    getDoc,
    updateDoc,
    doc,
    collection
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Import Firebase config
import { auth, db, COLLECTIONS, getDocRef, getCollectionRef, handleFirebaseError } from './b-firebase-config.js';

// ==========================================
// Authentication Functions
// ==========================================

// Register New User
export async function registerUser(name, email, password, phone, role) {
    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with name
        await updateProfile(user, {
            displayName: name
        });

        // Send email verification
        await sendEmailVerification(user);

        // Create user document in Firestore
        const userRef = doc(db, COLLECTIONS.USERS, user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            name: name,
            email: email,
            phone: phone,
            role: role || 'player',
            avatar: 'https://placehold.co/100x100',
            joinDate: new Date(),
            points: 0,
            diibBalance: 0,
            gamesCount: 0,
            assetsCount: 0,
            competitionsCount: 0,
            downloads: 0,
            earnings: 0,
            level: 1,
            rank: 999,
            bio: '',
            achievements: [],
            reviewsCount: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return { success: true, user };
    } catch (error) {
        console.error('Registration Error:', error);
        return { success: false, error: handleFirebaseError(error) };
    }
}

// Login User
export async function loginUser(email, password) {
    try {
        // Sign in user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if email is verified
        if (!user.emailVerified) {
            return { success: false, error: 'يرجى التحقق من بريدك الإلكتروني أولاً' };
        }

        // Check if user exists in Firestore, if not create
        const userRef = doc(db, COLLECTIONS.USERS, user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Create new user document
            await setDoc(userRef, {
                uid: user.uid,
                name: user.displayName || 'مستخدم',
                email: user.email,
                avatar: user.photoURL || 'https://placehold.co/100x100',
                role: 'player',
                joinDate: new Date(),
                points: 0,
                diibBalance: 0,
                gamesCount: 0,
                assetsCount: 0,
                competitionsCount: 0,
                downloads: 0,
                earnings: 0,
                level: 1,
                rank: 999,
                bio: '',
                achievements: [],
                reviewsCount: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }

        return { success: true, user };
    } catch (error) {
        console.error('Login Error:', error);
        return { success: false, error: handleFirebaseError(error) };
    }
}

// Logout User
export async function logoutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Logout Error:', error);
        return { success: false, error: handleFirebaseError(error) };
    }
}

// Login with Google
export async function loginWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user exists in Firestore, if not create
        const userRef = doc(db, COLLECTIONS.USERS, user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Create new user document
            await setDoc(userRef, {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL || 'https://placehold.co/100x100',
                role: 'player',
                joinDate: new Date(),
                points: 0,
                diibBalance: 0,
                gamesCount: 0,
                assetsCount: 0,
                competitionsCount: 0,
                downloads: 0,
                earnings: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }

        return { success: true, user };
    } catch (error) {
        console.error('Google Login Error:', error);
        return { success: false, error: handleFirebaseError(error) };
    }
}

// Reset Password
export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' };
    } catch (error) {
        console.error('Reset Password Error:', error);
        return { success: false, error: handleFirebaseError(error) };
    }
}

// Get User Data
export async function getUserData(userId) {
    try {
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return { success: true, data: userDoc.data() };
        } else {
            return { success: false, error: 'المستخدم غير موجود' };
        }
    } catch (error) {
        console.error('Get User Data Error:', error);
        return { success: false, error: handleFirebaseError(error) };
    }
}

// Update User Data
export async function updateUserData(userId, data, requestingUserId) {
    try {
        // Check if requesting user is authorized
        if (requestingUserId !== userId) {
            return { success: false, error: 'غير مصرح بتحديث بيانات هذا المستخدم' };
        }

        const userRef = doc(db, COLLECTIONS.USERS, userId);
        await updateDoc(userRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Update User Data Error:', error);
        return { success: false, error: handleFirebaseError(error) };
    }
}

// Export Auth Instance
export { auth, onAuthStateChanged };
