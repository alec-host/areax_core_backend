const axios = require("axios");

module.exports.postPayloadWithJsonPayload = async(url, data) => {
    try{
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //console.log('Response:', response?.data);
        return [true,response?.data];
    }catch(error){
        console.error('Error:', error);
        return [false, error?.message];
    }
};
