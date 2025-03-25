const { db2 } = require("../../models");

const InstagramActivityLogs = db2.instagrams.activities;

module.exports.getLatestUserInstagramActivityLog = (service,state) => {
    return new Promise((resolve, reject) => {
        InstagramActivityLogs.findOne({attributes: ['reference_number','client_type'], where:{service: service}, order:[['created_at', 'DESC']], limit: 1}).then((data) => {
	    if(data){	
               resolve(data);
	    }else{
	       resolve(null);	    
	    }
        }).catch(e => { 
            console.error(e);
            resolve(null);
        });
    });
};
