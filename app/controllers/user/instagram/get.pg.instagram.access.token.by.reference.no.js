const { db2 } = require("../../../models");

module.exports.getInstagramAccessTokenByReferenceNo = async (reference_number) => {
    try {
        const InstagramTokenModel = db2.pg_ig_tokens;
	    if (!InstagramTokenModel) console.log('DEBUG: InstagramTokenModel is undefined. db keys:', Object.keys(db2));
        const userRecord = await InstagramTokenModel.findOne({
            where: { reference_number: reference_number },
            attributes: ['long_lived_token']
        });
        return userRecord ? userRecord.long_lived_token : null;
    } catch (err) {
        console.error('Error: ', err);
        return null;
    }
};

