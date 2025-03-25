const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
//const { getUserInstagramIdByReferenceNo } = require("../user/get.user.instagram.id.by.reference.no");
//const { extractInstagramBasicData } = require("../../utils/extract.ig.user.basic.info");
const { instagramProfile, refreshLongLivedAccessToken } = require("../../services/INSTAGRAM");
const { connectToRedis, closeRedisConnection } = require("../../cache/redis");
//const { calculateInstagramTokenExpiry } = require("../user/instagram/user.instagram.token.expiry.date");
//const { insertOrUpdateUserInstagramActivityLog } = require("../user/instagram/store.user.instagram.data");
//const { insertOrUpdateUserInstagramToken } = require("../user/instagram/store.user.instagram.token");
const { calculateInstagramTokenExpiry } = require("../user/instagram/calculate.mongo.instagram.token.expiry.date");
const { saveInstagramUserData } = require("../user/instagram/store.mongo.instagram.data");
const { getUserInstagramProfileByReferenceNo } = require("../user/instagram/get.mongo.instagram.profile.by.reference.no");
const { deleteInstagramUserToken } = require("../user/instagram/delete.mongo.instagram.token");
const { deleteInstagramProfileData } = require("../user/instagram/delete.mongo.instagram.profile.data");

exports.GetInstagramBasicInfo = async(req,res) => {
    const errors = validationResult(req);
    const email = req.query.email;
    const reference_number = req.query.reference_number;

    if(errors.isEmpty()){
        try{
            const email_found = await findUserCountByEmail(email);
            if(email_found > 0){
                const reference_number_found = await findUserCountByReferenceNumber(reference_number);
                if(reference_number_found > 0){
                    const client = await connectToRedis();		
                    if(client){
			const dateDifferenceInDays = await calculateInstagramTokenExpiry(reference_number);   
			if(dateDifferenceInDays){
			    const longLivedToken = await client.get(reference_number);	
		            if(longLivedToken){		
			        if(dateDifferenceInDays >= 30 && dateDifferenceInDays < 50){	
                                    const newLongLivedToken = await refreshLongLivedAccessToken(longLivedToken);
				    const profile = await instagramProfile(newLongLivedToken);
				    const { id,user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count } = profile[1];
			            const payload = { reference_number,id,user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count };
				    await saveInstagramUserData(payload,reference_number);	
				    await saveInstagramUserToken({ reference_number: reference_number,access_token: longLivedToken,long_lived_token: newLongLivedToken });
				    client.set(reference_number,newLongLivedToken);
			        }else if(dateDifferenceInDays >= 50){
                                    await deleteInstagramUserToken(reference_number);
			            await deleteInstagramProfileData(reference_number);	
                                    res.status(401).json({
                                        success: false,
                                        error: true,
                                        message: "To continue using your Instagram account on Project W, please sign-in to Instagram."
                                    });
				    return;	
			        }else{
                                    await instagramProfile(longLivedToken);
			        }
			        await closeRedisConnection(client);		
			    }
			}else{
                            res.status(401).json({
                                success: false,
                                error: true,
                                message: "To continue using your Instagram account on Project W, please sign-in to Instagram."
                            });
			    return;	
			}
                    }
		    const instagramBasicInfo = await getUserInstagramProfileByReferenceNo(reference_number);	
                    try {
			if(instagramBasicInfo){    
                           res.status(200).json({
                               success: true,
                               error: false,
                               data: instagramBasicInfo,
                               message: "Instagram basic business information."
                           });
		        }else{
                           res.status(404).json({
                               success: false,
                               error: true,
                               data: [],
                               message: "To proceed allow Project W-IG App to access your data."
                           });
			}		
                    }catch(error){
                        console.error('Error parsing JSON:', error);
			const error_msg = error?.message || error?.response?.message || 'Something wrong has happened';    
                        res.status(400).json({
                            success: false,
                            error: true,
                            message: `ERROR: ${error_msg}`
                        });			    
                    }
                }else{
                    res.status(404).json({
                        success: false,
                        error: true,
                        message: "Reference number not found."
                    }); 
                }
            }else{
                res.status(404).json({
                    success: false,
                    error: true,
                    message: "Email not found."
                }); 
            }
        }catch(e){
            if(e){
		const error_msg = e?.message || e?.response?.message || 'Something wrong has happened';    
                res.status(500).json({
                    success: false,
                    error: true,
                    message: `ERROR: ${error_msg}`
                });
            }            
        }
    }else{
        res.status(422).json({ success: false, error: true, message: errors.array() });
    }
};
