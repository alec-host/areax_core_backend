const { adminSDK } = require("../firebase/firebase.admin");

module.exports.sendVerificationToken = async(phone) => {
    try{
        const verificationToken = await adminSDK.auth().createCustomToken(phone);
        return [true,verificationToken,'Phone verification token has been generated'];
    }catch(error){
        console.error('Error sending verification code:',error);
        return [false,'Error sending verification code:',error];
    } 
};

module.exports.verifyToken = async() => {
    try{
        adminSDK.auth().currentUser.getIdToken(true).then((idToken) => {
            if(idToken){
                const decodedToken = adminSDK.auth().verifyIdToken(idToken);
                return [true,decodedToken.phone_number];
            }else{
                return [false,'IdToken cannot be empty'];
            }
          }).catch(function(error) {
            return [false,error];
          });
    }catch(error){
        console.error('Error sending verification code:',error);
        return [false,'Error sending verification code:',error];
    } 
};