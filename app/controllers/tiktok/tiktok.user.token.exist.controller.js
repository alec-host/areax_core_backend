const { validationResult } = require("express-validator");

const { getUserTikTokProfile,refreshAccessToken } = require("../../services/TIKTOK");

const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getTikTokAccessTokenByReferenceNumber } = require("../user/tiktok/get.mongo.tiktok.token");

const { tiktokTokenExistByReferenceNo } = require("../user/tiktok/get.mongo.tiktok.token.exist.by.reference.no");

const { saveTikTokUserToken } = require("../user/tiktok/store.mongo.tiktok.token");
const { saveTikTokUserProfile } = require("../user/tiktok/store.mongo.tiktok.profile");

const { calculateTiktokTokenExpiry } = require("../user/tiktok/calculate.mongo.tiktok.token.expiry.date");

const { deleteTiktokUserToken } = require("../user/tiktok/delete.mongo.tiktok.token");
const { deleteTiktokProfileData } = require("../user/tiktok/delete.mongo.tiktok.profile.data");

exports.TiktokTokenExist = async(req, res) => {
    const { email, reference_number } = req.body;

    const errors = validationResult(req);
    if(errors.isEmpty()){
        const email_found = await findUserCountByEmail(email);
        if(email_found === 0){
            return res.status(404).json({ success: false, error: true, message: 'Email not found.' });
        }
        const reference_number_found = await findUserCountByReferenceNumber(reference_number);
        if(reference_number_found > 0){
            const tokenExist = await tiktokTokenExistByReferenceNo(reference_number);
            if(1===1){
                const dateDifferenceInDays = await calculateTiktokTokenExpiry(reference_number); 
                if(dateDifferenceInDays){
		    const tiktokTokens = await getTikTokAccessTokenByReferenceNumber(reference_number); 	
                    if(tiktokTokens){
                        if(dateDifferenceInDays >= 1 || dateDifferenceInDays <= 149){
			    const { access_token, refresh_token } = tiktokTokens;
			    const response = await refreshAccessToken(refresh_token);
			    if(response[0]){
				 await deleteTiktokUserToken(reference_number);   
                                 const { access_token, refresh_token, open_id, scope, expires_in } = response[1];
				 const payload = { reference_number, access_token, refresh_token, open_id, scope, expires_in };
				 await saveTikTokUserToken(payload);
				 const userInfo = await getUserTikTokProfile(access_token);
				 if(userInfo[0]){
			             await deleteTiktokProfileData(reference_number);		 
                                     const tiktokProfile = {
                                        reference_number: reference_number,
                                        display_name: userInfo[1].display_name,
                                        open_id: userInfo[1].open_id,
                                        profile_deep_link: userInfo[1].profile_deep_link,
                                        union_id: userInfo[1].union_id,
                                        avatar_url: userInfo[1].avatar_url,
                                        bio_description: userInfo[1].bio_description
                                     };
			             await saveTikTokUserProfile(tiktokProfile);		 
				 }   
			    }else{
                                return res.status(400).json({ success:false,error:true,message:response[1] });
			    }
                        }else if(dateDifferenceInDays >= 150){
                            await deleteTiktokUserToken(reference_number);
                            await deleteTiktokProfileData(reference_number);				
                            return res.status(401).json({ success: false, error: true, message: "To continue using your TikTok account on Project W, please sign-in to TikTok." });
                        }
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
