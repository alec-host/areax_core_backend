const axios = require('axios');
const dynamic = new Function('modulePath', 'return import(modulePath)');

const connectClient = async() => { 
   try{
       const { Client } = await dynamic('@gradio/client');
       const client = await Client.connect("MadsGalsgaard/WeAiU",{ hf_token: "hf_" }); 
       return client; 
   }catch(error){ 	   
       return null;
   }
};

const wakeUpSpace = async() => {
    const spaceUrl =  'https://huggingface.co/spaces/MadsGalsgaard/WeAiU';	
    try {
        const response = await axios.get(spaceUrl);
        console.log('Space is awake:', response.status);
    } catch (error) {
        console.error('Error waking up the Space:', error);
    }
};

const extractMessage = (response) => {
  const message = response.match(/^(.*?)<turn_end>/);
  return message ? message[1].trim() : "No message found";
};

const withTimeout = (promise, ms) => {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), ms)
    );
    return Promise.race([promise, timeout]);
};

module.exports.huggingFaceClient = async(_prompt) => {
  let client = await connectClient();
  if(!client){
      return [false,'Could not connect to huggingface'];
  }
  
  //await wakeUpSpace();

  try{	  
     const result = await withTimeout(client.predict("/chat",{
          message: _prompt,
          system_prompt: 'You are a friendly Chatbot. Provide summarized answers in bullet responses.',
          temperature: 0,
	  max_new_tokens: 1024,    
          top_p: 0, 		
	  top_k: 1,
       }),
       50000
     ).catch(error => {
	 return [false,error.message];    
     });
     
     if(!Array.isArray(result)){
	 return [true,result];
     }else{
	 return [false, result[1]];
     }	  
     console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvv ',result);
  }catch(error){
     console.log(error); 	  
     console.log('XXXXXXXXXXXXXX>>>>>>>>>>>> ',error.message);
     return [false, error.message];	  
  }
};
