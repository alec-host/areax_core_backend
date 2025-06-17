const { compare } = require("bcrypt");
const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { encrypt } = require("../../services/CRYPTO");
const { modifyUserByEmail } = require("../user/modify.user.by.email");
const { getUserPasswordByEmail } = require("../user/get.user.paswd.by.email");

module.exports.ChangePassword = async(req, res) => {
    const { email, reference_number, old_password, new_password, confirm_new_password } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({ success:false,error:true,message:errors.array() });
        return;	    
    }
    try{
       const email_found = await findUserCountByEmail(email);
       if(email_found === 0){
           res.status(404).json({
               success: false,
               error: true,
               message: 'Email not found.'
           });	       
	   return;
       }
       const reference_number_found = await findUserCountByReferenceNumber(reference_number);
       if(reference_number_found === 0){
           res.status(404).json({
               success: false,
               error: true,
               message: 'Reference number not found.'
           });	       
	   return;
       }
       const storedPassword = await getUserPasswordByEmail(email);
       const pppp = await encrypt('123456*');	
       const allowedAccess = await compare(old_password,storedPassword[0]);	
       //console.log('COMPARE: ', pppp);	
       if(!allowedAccess){
           res.status(400).json({
               success: false,
               error: true,
                message: "The provided password is invalid."
           });
	   return;
       }		
       if(new_password === confirm_new_password){
           if(old_password !== new_password){	
               //-update pass.
               const hashedPassword = await encrypt(new_password);
               const newPassword = { password: hashedPassword };
               const resp = await modifyUserByEmail(email,newPassword);
               if(resp){
                   res.status(200).json({
                       success: true,
                       error: false,
                       message: 'Password change was successful.'
                   });
               }else{
                   res.status(400).json({
                       success: false,
                       error: true,
                       message: 'Password change failed.'
                   });
               }
           }else{
               res.status(400).json({
                   success: false,
                   error: true,
                   message: 'assword change failed. The new password must be the same as the old password..'
               });
           }
       }else{
           res.status(400).json({
               success: false,
               error: true,
               message: 'Passwords do not match.'
           });
       }
    }catch(e){
        if(e){
            res.status(500).json({
                success: false,
                error: true,
                message: e?.response?.message || e?.message || 'Something wrong has happened'
            });
        }
    }
};
