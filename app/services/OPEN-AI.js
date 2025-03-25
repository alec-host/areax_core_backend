const { default: OpenAI } = require("openai");
const { OPEN_API_KEY } = require("../constants/app_constants");
const { INSTAGRAM_CAPTION_PROMPTING } = require("../prompt/prompts");
const { convertImageToDataURL } = require("../utils/image.data.url");

const configuration = {
    apiKey: OPEN_API_KEY,
};

const openai = new OpenAI(configuration);

module.exports.openAIClient = async(imageUrl) => {
    try{
        //-define the system instructions
        const systemInstructions = INSTAGRAM_CAPTION_PROMPTING;
	const imageData = await convertImageToDataURL(imageUrl);
        //-call OpenAI API to generate captions
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-1106",
          messages: [
            { role: "system", content: systemInstructions },
            { role: "user", content: [
		      {
		          "type": "image_url",
			  image_url:
			  {
			     "url": `${imageData}`
			  }
	              }
	    	    ] 
	    },
          ],
        });

        //-extract and display the captions
        const captions = completion.choices[0].message?.content.trim().split('\n');
	let response;    
        captions.forEach((caption, index) => {
           console.log(`Caption ${index + 1}: ${caption}`);
           response = `Caption ${index + 1}: ${caption}`;
        });
	return response;    
    }catch(error){
        console.error("Error generating captions:", error.message);
        return error.message;	    
    }
};
