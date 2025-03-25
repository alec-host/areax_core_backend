const { validationResult } = require("express-validator");

const { saveSystemErrors } = require("../user/error/store.mongo.system.error");
const { saveUserActivityData } = require("../user/activity/store.mongo.user.activity");
const { combinedErrorActivityData } = require('../user/combine.error.activity.log');

module.exports.CombinedActivityErrorLogs = async(req,res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    const errors = validationResult(req);
     if(errors.isEmpty()){
	try{
	   //const searchCriteria = search && search.trim() ? { $or: [{ reference_number: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
           //const escapeRegex = (string) => string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
           const searchCriteria = search && search.trim()
               ? { 
                  $or: [
                          { reference_number: { $regex: `^${search}$`, $options: 'i' } },
                          { email: { $regex: `^${search}$`, $options: 'i' } }
                       ] 
                 } 
                 : {  };		 		
	   const payload = { page, limit, search: searchCriteria };
           const combinedResults = await combinedErrorActivityData(payload);		
           res.status(200).json({
               success: true,
               error: false,
	       data: combinedResults,	   
               message: 'Activity and error logs.'
           });            
	}catch(e){
            if(e){
                res.status(500).json({
                    success: false,
                    error: true,
                    message: e?.message || e?.response?.message || 'Something wrong has happened'
                });
	    }
	}
     }else{
	res.status(422).json({ success: false, error: true, message: errors.array()});
     }   	
};
