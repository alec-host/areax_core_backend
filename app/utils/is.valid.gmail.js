module.exports.isValidGmail = (email) => {
  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return false; // not a valid email format
  }

  // Check if domain is gmail.com
  const domain = email.split('@')[1].toLowerCase();
  return domain === 'gmail.com';
};
