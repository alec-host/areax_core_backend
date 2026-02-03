const { db } = require("../../models");

const Users = db.users;

module.exports.modifyUserByEmail = async (email, payload) => {
   try {
      const [affectedRows] = await Users.update(payload, { where: { email: email } });
      if (affectedRows === 0) {
         return false;
      }
      return true;
   } catch (err) {
      console.error('modifyUserByEmail Error:', err.message);
      return false;
   }
};
