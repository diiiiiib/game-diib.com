// ==========================================
// GAME DIIB - Security Functions
// ==========================================

// ==========================================
// INPUT VALIDATION
// ==========================================

// Sanitize HTML to prevent XSS attacks
export function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Validate email format
export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate password strength
export function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return re.test(password);
}

// Validate phone number
export function validatePhone(phone) {
    const re = /^\+?[0-9]{10,15}$/;
    return re.test(phone);
}

// Validate file size (in bytes)
export function validateFileSize(file, maxSize) {
    return file.size <= maxSize;
}

// Validate file type
export function validateFileType(file, allowedTypes) {
    return allowedTypes.includes(file.type);
}

// Validate URL
export function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ==========================================
// AUTHORIZATION CHECKS
// ==========================================

// Check if user owns the resource
export function isOwner(userId, resourceOwnerId) {
    return userId === resourceOwnerId;
}

// Check if user is admin
export function isAdmin(user) {
    return user && user.role === 'admin';
}

// Check if user is moderator
export function isModerator(user) {
    return user && (user.role === 'admin' || user.role === 'moderator');
}

// ==========================================
// RATE LIMITING
// ==========================================

const rateLimitStore = new Map();

export function checkRateLimit(identifier, maxRequests, timeWindow) {
    const now = Date.now();
    const userRequests = rateLimitStore.get(identifier) || [];

    // Remove old requests outside the time window
    const recentRequests = userRequests.filter(timestamp => now - timestamp < timeWindow);

    if (recentRequests.length >= maxRequests) {
        return false;
    }

    // Add current request
    recentRequests.push(now);
    rateLimitStore.set(identifier, recentRequests);

    return true;
}

// ==========================================
// SECURITY HEADERS
// ==========================================

export function setSecurityHeaders() {
    // Content Security Policy
    const csp = "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' https://www.gstatic.com; " +
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com; " +
                "img-src 'self' data: https:; " +
                "connect-src 'self' https://*.firebaseio.com https://*.firebase.com; " +
                "frame-ancestors 'none';";

    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = csp;
    document.head.appendChild(meta);

    // X-Content-Type-Options
    const xContentType = document.createElement('meta');
    xContentType.httpEquiv = 'X-Content-Type-Options';
    xContentType.content = 'nosniff';
    document.head.appendChild(xContentType);

    // X-Frame-Options
    const xFrame = document.createElement('meta');
    xFrame.httpEquiv = 'X-Frame-Options';
    xFrame.content = 'DENY';
    document.head.appendChild(xFrame);

    // X-XSS-Protection
    const xXSS = document.createElement('meta');
    xXSS.httpEquiv = 'X-XSS-Protection';
    xXSS.content = '1; mode=block';
    document.head.appendChild(xXSS);
}

// ==========================================
// ERROR HANDLING
// ==========================================

export function handleSecurityError(error) {
    console.error('Security Error:', error);

    // Log security errors (in production, send to monitoring service)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        // Send error to monitoring service
        // Example: sendToMonitoringService(error);
    }

    // Show user-friendly error message
    showError('حدث خطأ أمني. يرجى المحاولة مرة أخرى.');
}
