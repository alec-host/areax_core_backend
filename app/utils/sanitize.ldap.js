// utils/sanitize.js
/**
 * Escapes characters commonly used in structured query injections (LDAP, regex, filters).
 * Safe to use for usernames, search terms, or any structured input.
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;

  return input
    .replace(/\\/g, '\\\\')   // Escape backslash
    .replace(/\*/g, '\\*')    // Escape asterisk
    .replace(/\(/g, '\\(')    // Escape left paren
    .replace(/\)/g, '\\)')    // Escape right paren
    .replace(/\0/g, '');      // Remove null byte
}

module.exports = { sanitizeInput };
