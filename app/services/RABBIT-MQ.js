const amqp = require("amqplib/callback_api");

module.exports.sendMessageToQueue = async(queueName, message) => {
    amqp.connect('amqp://localhost', (error0,connection) => {
        if(error0){
            console.error('ERROR: ',error0);
	    return null;
        }	    
	connection.createChannel((error1, channel) => {
	    if(error1){
                console.error('ERROR: ',error1);
	        return null;
	    }
	    channel.assertQueue(queueName, { durable: false });
            const options = {
                expiration: '300000'
	    };		
	    channel.sendToQueue(queueName, Buffer.from(message), options);
	    console.log(`Sent message to ${queueName}: ${message} `);	
	});
        setTimeout(()=> {
            connection.close();
	}, 500);		
    });
};

module.exports.readMessageFromQueue = async(queueName) => {
    return new Promise((resolve, reject) => {	
    	amqp.connect('amqp://localhost', (error0, connection) => { 
	    if(error0){ 
	       console.error('ERROR: ',error0);
               return reject(error0);		
	    }
	    connection.createChannel((error1, channel) => { 
	        if(error1){ 
	           console.error('ERROR: ',error1); 
	           return reject(error1);
	        }    
	        channel.assertQueue(queueName, { durable: false }); 
	        console.log(`Waiting for messages in queue: ${queueName}`);

	        channel.get(queueName,{ noAck: false }, (error2, msg) => { 
                    if(error2){ 
			connection.close(); 
			return reject(error2); 
		    }			
		    if(msg !== null){ 
		        const messageContent = msg?.content?.toString(); 
		        if(messageContent){	    
	                    console.log(`Received message: ${messageContent}`);

			    channel.ack(msg);
		        
			    channel.purgeQueue(queueName, (error3, ok) => {
                                if(error3){
				    console.error(`Error purging queue: ${error3}`);
			        }else{
                                    console.log(`Queue purged: ${ok.messageCount} messages deleted`);
			        }
			    });
			    setTimeout(() => {    
			        connection.close();    
		                resolve(messageContent);
			    },500);
			}else{
                            resolve(null);
			}
		    }else{
			console.log("No message in the queue");
			connection.close();    
			reject(null);
		    }
	        },{ noAck: false });
	    }); 
	}); 
    });
};
