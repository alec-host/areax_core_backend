const { db } = require("../../models");

const Users = db.users;

module.exports.modifyUserByEmail = async(email,payload) => {
    try{	
       const isUpdated = await Users.update(payload,{ where:{ email:email }}).catch(e => { return false; });	
       if(!isUpdated){
          return false;
       }
       return true;
    }catch(err){
       console.error('Error ',err.message);	    
       return false;
    }
};
