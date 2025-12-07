module.exports.generateReferralCode = (length=8) => {
   const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed confusing chars like 0, O, 1, I
   let result = '';
   for(let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
   }
   return result;
};
