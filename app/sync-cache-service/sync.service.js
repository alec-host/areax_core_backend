const { db } = require("../models");

const Users = db.users;

const { getUserProfileByEmail } = require("../controllers/user/get.user.profile.by.email.js");

const { connectToRedis, closeRedisConnection, setCache, deleteCache } = require("../cache/redis");

const updateSingleUserProfileCache = async (email) => {
    try{	
       const client = await connectToRedis(); 	    
       await getUserProfileByEmail(email,async user => {
	  if(user.length > 0){
	      await setCache(client,`user:${user[0].email}`, user);
	  }else{
              console.log('No record found.');
	  }  
       await closeRedisConnection(client);	       
       });
    }catch(err){
        console.error(err.message);
    }
};

Users.afterUpdate(async (user) => await updateSingleUserProfileCache(user[0].email));
Users.afterCreate(async (user) => await updateSingleUserProfileCache(user[0].email));
Users.afterDestroy(async (user) => { 
    const client = await connectToRedis();	
    await deleteCache(client,`user:${user[0].email}`);
    await closeRedisConnection(client);
});

module.exports = { updateSingleUserProfileCache };
