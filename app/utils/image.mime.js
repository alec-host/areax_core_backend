const axios = require("axios");

module.exports.getImageMime = async(imageUrl) => {
    try{
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        return imageResponse.headers['content-type'];
    }catch(error){
        return null;
    }
};
