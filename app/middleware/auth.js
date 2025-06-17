const { jwtVerifyToken } = require("../services/JWT");

const verifyToken = (req, res, next) => {
	try{
           //let token = req.body.token || req.query.token || req.params.token || req.headers["x-access-token"] || req.headers.authorization;
	   let token = req.body?.token || req.query?.token || req.params?.token || req.headers?.["x-access-token"] || req.headers?.authorization;	
        
           if (!token) {
               return res.status(403).json({
                   success: false,
                   error: true,
                   message: "A token is required for authentication"
               });
	   }

           // Ensure correct "Bearer <token>" format
           if (token.startsWith("Bearer ")) {
               token = token.split(" ")[1];
           }

           if (!token) {
               return res.status(401).json({
                   success: false,
                   error: true,
                   message: "Invalid token format"
               });
           }

           const resp = jwtVerifyToken(token);	
           if(!resp[0]){
               return res.status(401).json({
                   success: false,
                   error: true,
                   message: resp[1]
               });           
           }
           req.user = req[2];		
	   return next();	
        } catch (err) {
	    console.error(err.message);	
            return res.status(401).json({
                success: false,
                error: true,
                message: "Invalid Token"
            });
        }
    //return next();
  };
  
  module.exports = verifyToken;
