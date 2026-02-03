/**
 * security.middleware.js
 *
 * Provides recursive input sanitization to mitigate OWASP Top 10 risks:
 * 1. NoSQL Injection: Strips keys starting with $ or containing dots in objects.
 * 2. Cross-Site Scripting (XSS): Escapes HTML sensitive characters in strings.
 */

// const { escapeLDAP } = require('./sanitizeInput'); // Re-used LDAP logic removed as it's not used here

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} str
 */
function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Deeply sanitizes an object to prevent NoSQL injection and XSS.
 * @param {any} obj
 */
function sanitize(obj) {
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            obj[i] = sanitize(obj[i]);
        }
    } else if (obj !== null && typeof obj === 'object') {
        for (const key in obj) {
            // 1. Prevent NoSQL Injection: remove keys containing $ or .
            if (key.includes('$') || key.includes('.')) {
                console.warn(`[Security] Stripped potentially malicious NoSQL key: ${key}`);
                delete obj[key];
                continue;
            }

            if (typeof obj[key] === 'object') {
                obj[key] = sanitize(obj[key]);
            } else if (typeof obj[key] === 'string') {
                // 2. Prevent XSS: Escape HTML
                obj[key] = escapeHTML(obj[key]);
            }
        }
    }
    return obj;
}

/**
 * Middleware entry point.
 */
function securitySanitizer(req, res, next) {
    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);

    next();
}

module.exports = securitySanitizer;
