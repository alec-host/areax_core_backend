const { db } = require("../../models");

const Users = db.users;

module.exports.modifyUserByEmail = async(email,payload) => {
    console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ ',payload);
    try{	
    const isUpdated = await Users.update(payload,{ where:{ email:email }}).catch(e => { return false; });
    console.log('ZJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ: ',isUpdated);	
    if(!isUpdated){
        return false;
    }
       return true;
    }catch(err){
       console.error('ERRRRRRRRRRR ',err.message);	    
       return false;
    }
};
