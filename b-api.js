// ==========================================
// GAME DIIB - API Functions
// ==========================================

// ==========================================
// GAME DIIB - API Functions
// ==========================================

// Import Firebase config and services
import {
    db,
    storage,
    COLLECTIONS,
    getDocRef,
    getCollectionRef,
    handleFirebaseError,
    doc,
    getDoc,
    getDocs,
    collection,
    query,
    where,
    orderBy,
    limit,
    addDoc,
    updateDoc,
    deleteDoc,
    setDoc,
    arrayUnion,
    arrayRemove,
    increment,
    serverTimestamp,
    runTransaction,
    ref,
    uploadBytes,
    getStorageDownloadURL,
    deleteObject
} from './b-firebase-config.js';

// ==========================================
// USER FUNCTIONS
// ==========================================

// Get user by ID
export async function getUserById(userId) {
    try {
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting user:', error);
        throw handleFirebaseError(error);
    }
}

// Get user by email
export async function getUserByEmail(email) {
    try {
        const usersRef = collection(db, COLLECTIONS.USERS);
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return { id: userDoc.id, ...userDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting user by email:', error);
        throw handleFirebaseError(error);
    }
}

// Get all users
export async function getAllUsers() {
    try {
        const usersRef = collection(db, COLLECTIONS.USERS);
        const querySnapshot = await getDocs(usersRef);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting all users:', error);
        throw handleFirebaseError(error);
    }
}

// Update user data
export async function updateUser(userId, userData) {
    try {
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        await updateDoc(userRef, {
            ...userData,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error updating user:', error);
        throw handleFirebaseError(error);
    }
}

// Get user games
export async function getUserGames(userId) {
    try {
        const gamesRef = collection(db, COLLECTIONS.GAMES);
        const q = query(gamesRef, where('developerId', '==', userId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting user games:', error);
        throw handleFirebaseError(error);
    }
}

// Get user assets
export async function getUserAssets(userId) {
    try {
        const assetsRef = collection(db, COLLECTIONS.MODELS_3D);
        const q = query(assetsRef, where('developerId', '==', userId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting user assets:', error);
        throw handleFirebaseError(error);
    }
}

// Get user achievements
export async function getUserAchievements(userId) {
    try {
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData.achievements || [];
        }
        return [];
    } catch (error) {
        console.error('Error getting user achievements:', error);
        throw handleFirebaseError(error);
    }
}

// Get user activity
export async function getUserActivity(userId) {
    try {
        const notificationsRef = collection(db, COLLECTIONS.NOTIFICATIONS);
        const q = query(
            notificationsRef,
            where('userId', '==', userId),
            orderBy('timestamp', 'desc'),
            limit(10)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting user activity:', error);
        throw handleFirebaseError(error);
    }
}

// ==========================================
// GAME FUNCTIONS
// ==========================================

// Get all games
export async function getGames() {
    try {
        const gamesRef = collection(db, COLLECTIONS.GAMES);
        const q = query(gamesRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting games:', error);
        throw handleFirebaseError(error);
    }
}

// Get popular games
export async function getPopularGames() {
    try {
        const gamesRef = collection(db, COLLECTIONS.GAMES);
        const q = query(gamesRef, orderBy('downloads', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting popular games:', error);
        throw handleFirebaseError(error);
    }
}

// Get game by ID
export async function getGameById(gameId) {
    try {
        const gameRef = doc(db, COLLECTIONS.GAMES, gameId);
        const gameDoc = await getDoc(gameRef);

        if (gameDoc.exists()) {
            return { id: gameDoc.id, ...gameDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting game:', error);
        throw handleFirebaseError(error);
    }
}

// Create game
export async function createGame(gameData) {
    try {
        const gamesRef = collection(db, COLLECTIONS.GAMES);
        const gameDoc = await addDoc(gamesRef, {
            ...gameData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            downloads: 0,
            ratings: [],
            averageRating: 0
        });

        return { id: gameDoc.id, ...gameData };
    } catch (error) {
        console.error('Error creating game:', error);
        throw handleFirebaseError(error);
    }
}

// Update game
export async function updateGame(gameId, gameData, userId) {
    try {
        const gameRef = doc(db, COLLECTIONS.GAMES, gameId);
        const gameDoc = await getDoc(gameRef);

        if (!gameDoc.exists()) {
            throw new Error('اللعبة غير موجودة');
        }

        const game = gameDoc.data();

        // Check if user is the developer or admin
        if (game.developerId !== userId && game.role !== 'admin') {
            throw new Error('غير مصرح بتحديث هذه اللعبة');
        }

        await updateDoc(gameRef, {
            ...gameData,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error updating game:', error);
        throw handleFirebaseError(error);
    }
}

// Delete game
export async function deleteGame(gameId, userId) {
    try {
        const gameRef = doc(db, COLLECTIONS.GAMES, gameId);
        const gameDoc = await getDoc(gameRef);

        if (!gameDoc.exists()) {
            throw new Error('اللعبة غير موجودة');
        }

        const game = gameDoc.data();

        // Check if user is the developer or admin
        if (game.developerId !== userId && game.role !== 'admin') {
            throw new Error('غير مصرح بحذف هذه اللعبة');
        }

        await deleteDoc(gameRef);
        return true;
    } catch (error) {
        console.error('Error deleting game:', error);
        throw handleFirebaseError(error);
    }
}

// Rate game
export async function rateGame(gameId, userId, rating, comment) {
    try {
        await runTransaction(db, async (transaction) => {
            const gameRef = doc(db, COLLECTIONS.GAMES, gameId);
            const gameDoc = await transaction.get(gameRef);

            if (!gameDoc.exists()) {
                throw 'Game does not exist!';
            }

            const gameData = gameDoc.data();
            const ratings = gameData.ratings || [];

            // Check if user already rated this game
            const existingRatingIndex = ratings.findIndex(r => r.userId === userId);

            if (existingRatingIndex >= 0) {
                // Update existing rating
                ratings[existingRatingIndex] = {
                    userId,
                    rating,
                    comment,
                    timestamp: serverTimestamp()
                };
            } else {
                // Add new rating
                ratings.push({
                    userId,
                    rating,
                    comment,
                    timestamp: serverTimestamp()
                });
            }

            // Calculate new average rating
            const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = totalRating / ratings.length;

            // Update game with new ratings
            transaction.update(gameRef, {
                ratings,
                averageRating,
                ratingsCount: ratings.length
            });

            // Add rating to ratings collection
            const ratingsRef = collection(db, COLLECTIONS.RATINGS);
            await addDoc(ratingsRef, {
                gameId,
                userId,
                rating,
                comment,
                timestamp: serverTimestamp()
            });
        });

        return true;
    } catch (error) {
        console.error('Error rating game:', error);
        throw handleFirebaseError(error);
    }
}

// ==========================================
// ASSET FUNCTIONS
// ==========================================

// Get all assets
export async function getAssets() {
    try {
        const assetsRef = collection(db, COLLECTIONS.MODELS_3D);
        const q = query(assetsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting assets:', error);
        throw handleFirebaseError(error);
    }
}

// Get new assets (latest)
export async function getNewAssets(limitCount = 10) {
    try {
        const assetsRef = collection(db, COLLECTIONS.MODELS_3D);
        const q = query(assetsRef, orderBy('createdAt', 'desc'), limit(limitCount));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting new assets:', error);
        throw handleFirebaseError(error);
    }
}

// Get asset by ID
export async function getAssetById(assetId) {
    try {
        const assetRef = doc(db, COLLECTIONS.MODELS_3D, assetId);
        const assetDoc = await getDoc(assetRef);

        if (assetDoc.exists()) {
            return { id: assetDoc.id, ...assetDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting asset:', error);
        throw handleFirebaseError(error);
    }
}

// Create asset
export async function createAsset(assetData) {
    try {
        const assetsRef = collection(db, COLLECTIONS.MODELS_3D);
        const assetDoc = await addDoc(assetsRef, {
            ...assetData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            downloads: 0,
            ratings: [],
            averageRating: 0
        });

        return { id: assetDoc.id, ...assetData };
    } catch (error) {
        console.error('Error creating asset:', error);
        throw handleFirebaseError(error);
    }
}

// Update asset
export async function updateAsset(assetId, assetData) {
    try {
        const assetRef = doc(db, COLLECTIONS.MODELS_3D, assetId);
        await updateDoc(assetRef, {
            ...assetData,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error updating asset:', error);
        throw handleFirebaseError(error);
    }
}

// Delete asset
export async function deleteAsset(assetId) {
    try {
        const assetRef = doc(db, COLLECTIONS.MODELS_3D, assetId);
        await deleteDoc(assetRef);
        return true;
    } catch (error) {
        console.error('Error deleting asset:', error);
        throw handleFirebaseError(error);
    }
}

// Rate asset
export async function rateAsset(assetId, userId, rating, comment) {
    try {
        await runTransaction(db, async (transaction) => {
            const assetRef = doc(db, COLLECTIONS.MODELS_3D, assetId);
            const assetDoc = await transaction.get(assetRef);

            if (!assetDoc.exists()) {
                throw 'Asset does not exist!';
            }

            const assetData = assetDoc.data();
            const ratings = assetData.ratings || [];

            // Check if user already rated this asset
            const existingRatingIndex = ratings.findIndex(r => r.userId === userId);

            if (existingRatingIndex >= 0) {
                // Update existing rating
                ratings[existingRatingIndex] = {
                    userId,
                    rating,
                    comment,
                    timestamp: serverTimestamp()
                };
            } else {
                // Add new rating
                ratings.push({
                    userId,
                    rating,
                    comment,
                    timestamp: serverTimestamp()
                });
            }

            // Calculate new average rating
            const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = totalRating / ratings.length;

            // Update asset with new ratings
            transaction.update(assetRef, {
                ratings,
                averageRating,
                ratingsCount: ratings.length
            });

            // Add rating to model ratings collection
            const modelRatingsRef = collection(db, COLLECTIONS.MODEL_RATINGS);
            await addDoc(modelRatingsRef, {
                assetId,
                userId,
                rating,
                comment,
                timestamp: serverTimestamp()
            });
        });

        return true;
    } catch (error) {
        console.error('Error rating asset:', error);
        throw handleFirebaseError(error);
    }
}

// ==========================================
// COMPETITION FUNCTIONS
// ==========================================

// Get all competitions
export async function getCompetitions() {
    try {
        const competitionsRef = collection(db, COLLECTIONS.COMPETITIONS);
        const q = query(competitionsRef, orderBy('startDate', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting competitions:', error);
        throw handleFirebaseError(error);
    }
}

// Get active competitions
export async function getActiveCompetitions() {
    try {
        const now = new Date();
        const competitionsRef = collection(db, COLLECTIONS.COMPETITIONS);
        const q = query(
            competitionsRef,
            where('startDate', '<=', now),
            where('endDate', '>=', now),
            orderBy('startDate', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting active competitions:', error);
        throw handleFirebaseError(error);
    }
}

// Get competition by ID
export async function getCompetitionById(competitionId) {
    try {
        const competitionRef = doc(db, COLLECTIONS.COMPETITIONS, competitionId);
        const competitionDoc = await getDoc(competitionRef);

        if (competitionDoc.exists()) {
            return { id: competitionDoc.id, ...competitionDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting competition:', error);
        throw handleFirebaseError(error);
    }
}

// Create competition
export async function createCompetition(competitionData) {
    try {
        const competitionsRef = collection(db, COLLECTIONS.COMPETITIONS);
        const competitionDoc = await addDoc(competitionsRef, {
            ...competitionData,
            createdAt: serverTimestamp(),
            participants: [],
            submissions: []
        });

        return { id: competitionDoc.id, ...competitionData };
    } catch (error) {
        console.error('Error creating competition:', error);
        throw handleFirebaseError(error);
    }
}

// Join competition
export async function joinCompetition(competitionId, userId) {
    try {
        const competitionRef = doc(db, COLLECTIONS.COMPETITIONS, competitionId);
        await updateDoc(competitionRef, {
            participants: arrayUnion(userId)
        });

        // Add participant record
        const participantsRef = collection(db, COLLECTIONS.COMPETITION_PARTICIPANTS);
        await addDoc(participantsRef, {
            competitionId,
            userId,
            joinedAt: serverTimestamp()
        });

        return true;
    } catch (error) {
        console.error('Error joining competition:', error);
        throw handleFirebaseError(error);
    }
}

// ==========================================
// NOTIFICATION FUNCTIONS
// ==========================================

// Get user notifications
export async function getUserNotifications(userId) {
    try {
        const notificationsRef = collection(db, COLLECTIONS.NOTIFICATIONS);
        const q = query(
            notificationsRef,
            where('userId', '==', userId),
            orderBy('timestamp', 'desc'),
            limit(20)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting notifications:', error);
        throw handleFirebaseError(error);
    }
}

// Create notification
export async function createNotification(notificationData) {
    try {
        const notificationsRef = collection(db, COLLECTIONS.NOTIFICATIONS);
        const notificationDoc = await addDoc(notificationsRef, {
            ...notificationData,
            timestamp: serverTimestamp(),
            read: false
        });

        return { id: notificationDoc.id, ...notificationData };
    } catch (error) {
        console.error('Error creating notification:', error);
        throw handleFirebaseError(error);
    }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId) {
    try {
        const notificationRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
        await updateDoc(notificationRef, {
            read: true
        });
        return true;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw handleFirebaseError(error);
    }
}

// ==========================================
// COMMENT FUNCTIONS
// ==========================================

// Get comments for a game
export async function getGameComments(gameId) {
    try {
        const commentsRef = collection(db, COLLECTIONS.COMMENTS);
        const q = query(
            commentsRef,
            where('gameId', '==', gameId),
            orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting game comments:', error);
        throw handleFirebaseError(error);
    }
}

// Get comments for an asset
export async function getAssetComments(assetId) {
    try {
        const commentsRef = collection(db, COLLECTIONS.MODEL_COMMENTS);
        const q = query(
            commentsRef,
            where('assetId', '==', assetId),
            orderBy('timestamp', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting asset comments:', error);
        throw handleFirebaseError(error);
    }
}

// Add comment to game
export async function addGameComment(gameId, userId, comment) {
    try {
        const commentsRef = collection(db, COLLECTIONS.COMMENTS);
        const commentDoc = await addDoc(commentsRef, {
            gameId,
            userId,
            comment,
            timestamp: serverTimestamp()
        });

        return { id: commentDoc.id, gameId, userId, comment };
    } catch (error) {
        console.error('Error adding game comment:', error);
        throw handleFirebaseError(error);
    }
}

// Add comment to asset
export async function addAssetComment(assetId, userId, comment) {
    try {
        const commentsRef = collection(db, COLLECTIONS.MODEL_COMMENTS);
        const commentDoc = await addDoc(commentsRef, {
            assetId,
            userId,
            comment,
            timestamp: serverTimestamp()
        });

        return { id: commentDoc.id, assetId, userId, comment };
    } catch (error) {
        console.error('Error adding asset comment:', error);
        throw handleFirebaseError(error);
    }
}

// ==========================================
// STORAGE FUNCTIONS
// ==========================================

// Upload file to storage
export async function uploadFile(file, path) {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw handleFirebaseError(error);
    }
}

// Delete file from storage
export async function deleteFile(path) {
    try {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
        return true;
    } catch (error) {
        console.error('Error deleting file:', error);
        throw handleFirebaseError(error);
    }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Get recent updates
export async function getRecentUpdates() {
    try {
        const updates = [];

        // Get recent games
        const gamesRef = collection(db, COLLECTIONS.GAMES);
        const gamesQuery = query(gamesRef, orderBy('createdAt', 'desc'), limit(3));
        const gamesSnapshot = await getDocs(gamesQuery);

        gamesSnapshot.forEach(doc => {
            updates.push({
                type: 'game',
                content: `🎮 لعبة جديدة: ${doc.data().title}`,
                timestamp: doc.data().createdAt
            });
        });

        // Get recent assets
        const assetsRef = collection(db, COLLECTIONS.MODELS_3D);
        const assetsQuery = query(assetsRef, orderBy('createdAt', 'desc'), limit(3));
        const assetsSnapshot = await getDocs(assetsQuery);

        assetsSnapshot.forEach(doc => {
            updates.push({
                type: 'asset',
                content: `🎨 أصل جديد: ${doc.data().title}`,
                timestamp: doc.data().createdAt
            });
        });

        // Sort by timestamp
        updates.sort((a, b) => b.timestamp - a.timestamp);

        return updates.slice(0, 5);
    } catch (error) {
        console.error('Error getting recent updates:', error);
        throw handleFirebaseError(error);
    }
}

// ==========================================
// RANKING FUNCTIONS
// ==========================================

// Get all users ranked by points
export async function getRankedUsers() {
    try {
        const usersRef = collection(db, COLLECTIONS.USERS);
        const q = query(usersRef, orderBy('points', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc, index) => ({ 
            id: doc.id, 
            rank: index + 1, 
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting ranked users:', error);
        throw handleFirebaseError(error);
    }
}

// ==========================================
// COMMUNITY FUNCTIONS
// ==========================================

// Get all community posts
export async function getCommunityPosts() {
    try {
        const postsRef = collection(db, 'community_posts');
        const q = query(postsRef, orderBy('timestamp', 'desc'), limit(20));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting community posts:', error);
        throw handleFirebaseError(error);
    }
}

// Create community post
export async function createCommunityPost(postData) {
    try {
        const postsRef = collection(db, 'community_posts');
        const postDoc = await addDoc(postsRef, {
            ...postData,
            timestamp: serverTimestamp(),
            likes: 0,
            comments: 0
        });

        return { id: postDoc.id, ...postData };
    } catch (error) {
        console.error('Error creating community post:', error);
        throw handleFirebaseError(error);
    }
}

// Like community post
export async function likeCommunityPost(postId, userId) {
    try {
        const postRef = doc(db, 'community_posts', postId);
        await updateDoc(postRef, {
            likes: increment(1)
        });
        return true;
    } catch (error) {
        console.error('Error liking post:', error);
        throw handleFirebaseError(error);
    }
}

// ==========================================
// TRANSACTION FUNCTIONS
// ==========================================

// Get user transactions
export async function getUserTransactions(userId) {
    try {
        const transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
        const q = query(
            transactionsRef,
            where('userId', '==', userId),
            orderBy('timestamp', 'desc'),
            limit(20)
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting transactions:', error);
        throw handleFirebaseError(error);
    }
}

// Create deposit transaction
export async function createDeposit(userId, amount, method) {
    try {
        const transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
        const transactionDoc = await addDoc(transactionsRef, {
            userId,
            type: 'deposit',
            amount,
            method,
            status: 'pending',
            timestamp: serverTimestamp()
        });

        // Update user balance
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        await updateDoc(userRef, {
            diibBalance: increment(amount),
            updatedAt: serverTimestamp()
        });

        return { id: transactionDoc.id, userId, type: 'deposit', amount, method, status: 'pending' };
    } catch (error) {
        console.error('Error creating deposit:', error);
        throw handleFirebaseError(error);
    }
}

// Create withdrawal transaction
export async function createWithdrawal(userId, amount, method, accountDetails) {
    try {
        const transactionsRef = collection(db, COLLECTIONS.TRANSACTIONS);
        const transactionDoc = await addDoc(transactionsRef, {
            userId,
            type: 'withdrawal',
            amount,
            method,
            accountDetails,
            status: 'pending',
            timestamp: serverTimestamp()
        });

        // Update user balance
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        await updateDoc(userRef, {
            diibBalance: increment(-amount),
            updatedAt: serverTimestamp()
        });

        return { id: transactionDoc.id, userId, type: 'withdrawal', amount, method, accountDetails, status: 'pending' };
    } catch (error) {
        console.error('Error creating withdrawal:', error);
        throw handleFirebaseError(error);
    }
}

// ==========================================
// GLOBAL EXPORTS
// ==========================================
// Note: Functions are exported in b-index.html
