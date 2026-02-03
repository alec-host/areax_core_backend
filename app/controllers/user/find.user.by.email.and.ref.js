const { db } = require("../../models");

const Users = db.users;

module.exports.findUserByEmailAndRef = async (email, reference_number, transaction = null) => {
    const options = { where: { email, reference_number } };
    if (transaction) options.transaction = transaction;

    const user = await Users.findOne(options);
    return user;
};

