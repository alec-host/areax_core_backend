const amqp = require("amqplib");

const { RABBITMQ_URL,RABBITMQ_EXCHANGE,RABBITMQ_ROUTING_KEY } = require("../constants/app_constants.js");

module.exports.sendMessageToQueue_OLD = async(queueName, message) => {
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

module.exports.sendMessageToQueue = async(queueName, message) => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        console.log('Connected to RabbitMQ');

        const channel = await connection.createChannel();

        await channel.assertExchange(RABBITMQ_EXCHANGE, 'topic', { durable: true });

        await channel.assertQueue(queueName, { durable: false });
        await channel.bindQueue(queueName, RABBITMQ_EXCHANGE, RABBITMQ_ROUTING_KEY);

        // Publish the message to the queue
        const options = {
           expiration: '300000',
	   contentType: 'application/json'	
        };	    

        channel.publish(RABBITMQ_EXCHANGE, RABBITMQ_ROUTING_KEY, Buffer.from(message), options);
        console.log(`Message sent to queue "${queueName}": ${message}`);
        // Close the connection after a delay (optional)
        setTimeout(() => {
            channel.close();
            connection.close();
            console.log('Connection closed');
        }, 500);
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error.message);
    }
};

module.exports.readMessageFromQueue_OLD = async(queueName) => {
    return new Promise((resolve, reject) => {	
    	amqp.connect(RABBITMQ_URL,(error0, connection) => { 
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

module.exports.readMessageFromQueue = async(routingKey,queueName) => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

	await channel.assertExchange(RABBITMQ_EXCHANGE, 'topic', { durable: true });    

        await channel.assertQueue(queueName, { durable: false });
	await channel.bindQueue(queueName, RABBITMQ_EXCHANGE, routingKey);    
        console.log(`Waiting for messages in queue: ${queueName}`);

        const msg = await channel.get(queueName, { noAck: false });

        if (msg) {
            const messageContent = msg.content.toString();
            console.log(`Received message: ${messageContent}`);

            // Acknowledge message
            channel.ack(msg);

            // Purge Queue (Optional)
            try {
                const ok = await channel.purgeQueue(queueName);
                console.log(`Queue purged: ${ok.messageCount} messages deleted`);
            } catch (purgeError) {
                console.error(`Error purging queue: ${purgeError}`);
            }

            // Close connection after short delay
            setTimeout(async () => {
                await connection.close();
            }, 500);

            return messageContent;
        } else {
            console.log("No message in the queue");
            await connection.close();
            return null;
        }
    } catch (error) {
        console.error("ERROR:", error);
        throw error;
    }
};
