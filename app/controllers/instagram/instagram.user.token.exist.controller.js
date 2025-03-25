const { validationResult } = require("express-validator");
const { connectToRedis, closeRedisConnection } = require("../../cache/redis");
const { instagramProfile, refreshLongLivedAccessToken } = require("../../services/INSTAGRAM");

const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { instagramTokenExistByReferenceNo } = require("../user/instagram/get.mongo.instagram.token.exist.by.reference.no");            
const { saveInstagramUserToken } = require("../user/instagram/store.mongo.instagram.token");

const { calculateInstagramTokenExpiry } = require("../user/instagram/calculate.mongo.instagram.token.expiry.date");
const { saveInstagramUserData } = require("../user/instagram/store.mongo.instagram.data");
const { getUserInstagramProfileByReferenceNo } = require("../user/instagram/get.mongo.instagram.profile.by.reference.no");
const { deleteInstagramUserToken } = require("../user/instagram/delete.mongo.instagram.token");
const { deleteInstagramProfileData } = require("../user/instagram/delete.mongo.instagram.profile.data");

exports.InstagramTokenExist = async(req, res) => {
    const { email, reference_number } = req.body;

    const errors = validationResult(req);
    if(errors.isEmpty()){
	const email_found = await findUserCountByEmail(email);
	if(email_found === 0){
            return res.status(404).json({ success: false, error: true, message: 'Email not found.' });	
	}    
	const reference_number_found = await findUserCountByReferenceNumber(reference_number);    
        if(reference_number_found > 0){
            const tokenExist = await instagramTokenExistByReferenceNo(reference_number);
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
                            return res.status(401).json({ success: false, error: true, message: "To continue using your Instagram account on Project W, please sign-in to Instagram." });
			}else{
                            await instagramProfile(longLivedToken);
			}
			await closeRedisConnection(client);    
		    }
		}   
	    }	
            if(tokenExist > 0){
                res.status(200).json({
                    success: true,
                    error: false,
                    token_exist:tokenExist,
                    message: 'Token has been found'
                });
            }else{
                res.status(404).json({
                    success: false,
                    error: true,
                    token_exist: 0,
                    message: 'Token not found'
                });
            }
        }else{
            res.status(400).json({
                success: false,
                error: true,
                message: 'Reference number must be checked.'
            });
        }
    }else{
        res.status(422).json({ success: false, error: true, message: errors.array() });
    }
};
