const { validationResult } = require('express-validator');
const { getUsersLocationList } = require("../user/mongo.get.users.location");

module.exports.GetUsersLocation = async(req,res) => {
    const { list, start, limit } = req.query;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
             result = await getUsersLocationList(start, limit);	
	     if(result){	
                 res.status(200).json({
                    success: true,
                    error: false,
	            data: result,		 
                    message: "Users location list"
                 });
	     }else{
                 res.status(404).json({
                    success: false,
                    error: true,
	            data: [],		 
                    message: "No users location list"
                 });
	     }
        }catch(e){
            if(e){
                console.log(e);
                res.status(500).json({
                    success: false,
                    error: true,
                    message: e?.response?.message || 'Something wrong has happened'
                });
            }
        }
    }else{
        res.status(422).json({errors: errors.array()});
    }
};
