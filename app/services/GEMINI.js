const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const { getImageMime } = require('../utils/image.mime');

const { GEMINI_API_KEY } = require('../constants/app_constants');
const { INSTAGRAM_CAPTION_PROMPTING } = require('../prompt/prompts');
const { getImageAsBase64 } = require('../utils/image.base64');

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
};

//-.initialize the Gemini model with custom system instructions
const generativeAI = new GoogleGenerativeAI(GEMINI_API_KEY);

//-.function to verify the image at the given URL
const verifyImage = async (imageUrl) => {
    const axios = require('axios');
    try{
        const response = await axios.get(imageUrl);
        return response.status === 200;
    }catch (error){
        console.error('Image verification failed:', error);
        return false;
    }
};

module.exports.geminiClient = async(imageUrl) => {
    const imageMime = await getImageMime(imageUrl);
    if(await verifyImage(imageUrl)){
        const model = generativeAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: INSTAGRAM_CAPTION_PROMPTING });
        const imgBase64 = await getImageAsBase64(imageUrl);
        const session = model.startChat({ 
            generationConfig,
            history: [
                {
                    role: 'user',
                    parts: [
                        {
                            inlineData: {
                                data: imgBase64,
                                mimeType: imageMime,
                            },
                        },
                    ],
                },
            ],
        });
        const chatReply = await session.sendMessage('dd');
        return [true,chatReply.response.text()];
    }else{
        return [false,'Invalid image'];
    }
};
