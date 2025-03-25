const { db2 } = require("../../../models");

const InstagramLongLivedToken = db2.instagrams.tokens;

module.exports.insertOrUpdateUserInstagramToken = async(reference_number,access_token,long_lived_token) => {
    try{
        await InstagramLongLivedToken.upsert({
            reference_number: reference_number,
            access_token: access_token,
            long_lived_token: long_lived_token,
            created_at: new Date()
        });    
        console.log('Instagram token inserted or updated successfully.');
    }catch(err){
        console.error('Error: failed to insert or update. ',err);
    }
};
