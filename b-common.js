// ==========================================
// GAME DIIB - Common Functions
// ==========================================

// Import Firebase services
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

// Import Firebase config
import { auth, db, COLLECTIONS, getDocRef, getCollectionRef, handleFirebaseError } from './b-firebase-config.js';

// Import API functions
import { getUserById, getRecentUpdates } from './b-api.js';

// ==========================================
// SECURITY FUNCTIONS
// ==========================================

// Sanitize HTML to prevent XSS attacks
export function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ==========================================
// UI FUNCTIONS
// ==========================================

// Show error message
export function showError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.textContent = message;
    errorContainer.style.cssText = `
        background: rgba(239, 68, 68, 0.1);
        color: #EF4444;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 16px;
        text-align: center;
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        max-width: 90%;
        font-size: 14px;
        font-weight: 500;
    `;

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(errorContainer, mainContent.firstChild);
    }

    // Hide after 5 seconds
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 5000);
}

// Show success message
export function showSuccess(message) {
    const successContainer = document.createElement('div');
    successContainer.className = 'success-message';
    successContainer.textContent = message;
    successContainer.style.cssText = `
        background: rgba(34, 197, 94, 0.1);
        color: #22C55E;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 16px;
        text-align: center;
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        max-width: 90%;
        font-size: 14px;
        font-weight: 500;
    `;

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(successContainer, mainContent.firstChild);
    }

    // Hide after 5 seconds
    setTimeout(() => {
        successContainer.style.display = 'none';
    }, 5000);
}

// Show loading spinner
export function showLoading() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 50px;
        height: 50px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;

    loadingOverlay.appendChild(spinner);
    document.body.appendChild(loadingOverlay);
}

// Hide loading spinner
export function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// ==========================================
// AUTHENTICATION FUNCTIONS
// ==========================================

// Check if user is authenticated
export function isAuthenticated() {
    return auth.currentUser !== null;
}

// Get current user
export function getCurrentUser() {
    return auth.currentUser;
}

// Logout user
export async function logout() {
    try {
        await auth.signOut();
        showSuccess('تم تسجيل الخروج بنجاح');
        window.location.href = 'b-login.html';
    } catch (error) {
        showError('حدث خطأ في تسجيل الخروج');
        console.error(error);
    }
}

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================

// Navigate to page
export function navigateTo(page) {
    window.location.href = page;
}

// Navigate to dashboard
export function navigateToDashboard() {
    navigateTo('b-account.html');
}

// Navigate to search
export function navigateToSearch() {
    navigateTo('b-search.html');
}

// Navigate to notifications
export function navigateToNotifications() {
    navigateTo('b-notifications.html');
}

// Navigate to profile
export function navigateToProfile() {
    navigateTo('b-profile.html');
}

// Navigate to store
export function navigateToStore() {
    navigateTo('b-store.html');
}

// Navigate to community
export function navigateToCommunity() {
    navigateTo('b-community.html');
}

// Navigate to competitions
export function navigateToCompetitions() {
    navigateTo('b-competitions.html');
}

// Navigate to rankings
export function navigateToRankings() {
    navigateTo('b-rankings.html');
}

// Navigate to publish
export function navigateToPublish() {
    navigateTo('b-publish.html');
}

// Navigate to earnings
export function navigateToEarnings() {
    navigateTo('b-earnings.html');
}

// Navigate to analytics
export function navigateToAnalytics() {
    navigateTo('b-analytics.html');
}

// Navigate to index
export function navigateToIndex() {
    navigateTo('index.html');
}

// Navigate to login
export function navigateToLogin() {
    navigateTo('b-login.html');
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Get time ago
export function getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = now - past;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
        return `${minutes} دقيقة`;
    } else if (hours < 24) {
        return `${hours} ساعة`;
    } else {
        return `${days} يوم`;
    }
}

// Calculate days left
export function calculateDaysLeft(endDate) {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = Math.abs(end - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Get role text
export function getRoleText(role) {
    const roleTexts = {
        'player': 'لاعب',
        'developer': 'مطور',
        'designer': 'مصمم',
        'admin': 'مدير'
    };
    return roleTexts[role] || role;
}

// Format number
export function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Format currency
export function formatCurrency(amount) {
    if (amount === null || amount === undefined) {
        return '0.00 DIIB';
    }
    return amount.toFixed(2) + ' DIIB';
}

// ==========================================
// DATA LOADING FUNCTIONS
// ==========================================

// Load user data
export async function loadUserData(userId) {
    try {
        const userData = await getUserById(userId);
        if (userData) {
            // Update user avatar
            const userAvatar = document.querySelector('.user-avatar');
            if (userAvatar) {
                userAvatar.src = userData.avatar || 'https://placehold.co/100x100';
            }

            // Update user name
            const userName = document.querySelector('.user-name');
            if (userName) {
                userName.textContent = userData.name || 'مستخدم';
            }

            // Update user email
            const userEmail = document.querySelector('.user-email');
            if (userEmail) {
                userEmail.textContent = userData.email || '';
            }

            // Update user role
            const userRole = document.querySelector('.user-role');
            if (userRole) {
                userRole.textContent = getRoleText(userData.role);
            }

            // Update DIIB balance
            const diibBalance = document.querySelector('.diib-balance');
            if (diibBalance) {
                diibBalance.textContent = formatCurrency(userData.diibBalance || 0);
            }

            return userData;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        showError('حدث خطأ في تحميل بيانات المستخدم');
    }
}

// Load recent updates
export async function loadRecentUpdates() {
    try {
        const updates = await getRecentUpdates();
        const updatesContainer = document.querySelector('.recent-updates');

        if (updatesContainer && updates.length > 0) {
            updatesContainer.innerHTML = '';

            updates.forEach(update => {
                const updateElement = document.createElement('div');
                updateElement.className = 'update-item';
                updateElement.innerHTML = `
                    <div class="update-content">${update.content}</div>
                    <div class="update-time">${getTimeAgo(update.timestamp)}</div>
                `;
                updatesContainer.appendChild(updateElement);
            });
        } else if (updatesContainer) {
            updatesContainer.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--text-secondary);">لا توجد تحديثات حالياً</p>';
        }
    } catch (error) {
        console.error('Error loading recent updates:', error);
        showError('حدث خطأ في تحميل التحديثات');
    }
}

// ==========================================
// GLOBAL EXPORTS
// ==========================================

// Make functions globally available
window.showError = showError;
window.showSuccess = showSuccess;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.navigateTo = navigateTo;
window.navigateToDashboard = navigateToDashboard;
window.navigateToSearch = navigateToSearch;
window.navigateToNotifications = navigateToNotifications;
window.navigateToProfile = navigateToProfile;
window.navigateToStore = navigateToStore;
window.navigateToCommunity = navigateToCommunity;
window.navigateToCompetitions = navigateToCompetitions;
window.navigateToRankings = navigateToRankings;
window.navigateToPublish = navigateToPublish;
window.navigateToEarnings = navigateToEarnings;
window.navigateToAnalytics = navigateToAnalytics;
window.navigateToIndex = navigateToIndex;
window.navigateToLogin = navigateToLogin;
window.getTimeAgo = getTimeAgo;
window.calculateDaysLeft = calculateDaysLeft;
window.getRoleText = getRoleText;
window.formatNumber = formatNumber;
window.formatCurrency = formatCurrency;
window.loadUserData = loadUserData;
window.loadRecentUpdates = loadRecentUpdates;
