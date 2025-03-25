const { validationResult } = require("express-validator");

exports.HealthCheck = async(req,res) => {
    const { word } = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{ 
            res.status(200).json({
                success: true,
                error: false,
                message: 'Server is up - you posted the word: ' + word
            });          
        }catch(e){
            if(e){
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