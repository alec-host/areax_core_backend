const { jwtVerifyToken } = require("../../services/JWT");
module.exports.validateAcccessToken = async(accessToken) => {
   const decoded = jwtVerifyToken(accessToken);
   if(decoded){
        return true;
   }else{
	return false;
   }
};
