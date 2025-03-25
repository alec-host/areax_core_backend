const axios = require("axios");

module.exports.convertImageToDataURL = async(imageUrl) => {
    try{
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
        return `data:${imageResponse.headers['content-type']};base64,${base64Image}`;
    }catch(error){
	console.log('EEEE: ',error.message);    
        return null;
    }
};
