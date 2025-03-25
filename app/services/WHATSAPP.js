const axios = require('axios');
const { WHATSAPP_ACCESS_TOKEN,WHATSAPP_DUBAI_PHONE_ID } = require("../constants/app_constants");

module.exports.sendWhatsAppTextMessage = async(payload) => {
    try{
       	    
        let config = {
	    method: 'post',
            maxBodyLength: Infinity,
            url: `https://graph.facebook.com/v20.0/${WHATSAPP_DUBAI_PHONE_ID}/messages`,
            headers: { 
               'Content-Type': 'application/json', 
               'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`      
	    },
            data: payload
     	};	    

     	const response = await axios.request(config);
     	return JSON.stringify(response.data);	
    }catch(err){
	console.error(err);    
	return null;
    }
};

module.exports.initWhatsAppOtpPayload = (otp,recipient) => { 
   if(otp && recipient){	
      const payload = JSON.stringify({
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": `${recipient}`,
          "type": "template",
          "template": {
              "name": "verification_code",
              "language": {
                  "code": "en"
              },
              "components": [
                { 
                   "type": "body",
                   "parameters": [
                    {
                       "type": "text",
                       "text": `${otp}`
                    }
                   ]
                },
                {
                   "type": "button",
                   "sub_type": "url",
                   "index": "0",
                   "parameters": [
                    {
                       "type": "text",
                       "text": "https://"
                    }
                   ]
                }
              ]
           }
       });
	   
       return payload;	
   }else{
       return null;
   }
};
