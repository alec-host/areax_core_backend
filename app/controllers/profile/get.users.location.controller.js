const { validationResult } = require('express-validator');
const { getUsersLocationList } = require("../user/mongo.get.users.location");

module.exports.GetUsersLocation = async(req,res) => {
    const { list, start, limit } = req.query;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({success: false, error: true, message: errors.array()});
	return;
    }
    try{
        const result = await getUsersLocationList(start, limit);	
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
            res.status(500).json({
                success: false,
                error: true,
                message: e?.response?.message || 'Something wrong has happened'
            });
        }
    }
};
