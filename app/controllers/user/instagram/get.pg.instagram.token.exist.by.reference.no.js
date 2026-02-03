const { db2 } = require("../../../models");


module.exports.instagramTokenExistByReferenceNo = async (reference_number) => {
    try {
        const InstagramTokenModel = db2.pg_ig_tokens;
        const userRecord = await InstagramTokenModel.findOne({
            where: { reference_number: reference_number },
            attributes: ['_id']
        });
        return userRecord ? 1 : 0;
    } catch (err) {
        console.error('Error: ', err);
        return 0;
    }
};

