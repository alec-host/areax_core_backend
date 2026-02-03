const amqp = require("amqplib");

const { RABBITMQ_URL,RABBITMQ_EXCHANGE,RABBITMQ_ROUTING_KEY } = require("../constants/app_constants.js");

let connection = null;
let channel = null;

/**
 * Internal helper to ensure we have a single, healthy connection/channel.
 */
async function getChannel() {
    if (channel) return channel; // Return cached channel if it exists
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        // Listen for crashes/closes to reset the cache
        connection.on('error', (err) => { channel = null; connection = null; });
        connection.on('close', () => { channel = null; connection = null; });

        return channel;
    } catch (error) {
        channel = null;
        connection = null;
        throw error;
    }
}

module.exports.sendMessageToQueue = async(queueName, message) => {
    try {
        const chan = await getChannel();

        await chan.assertExchange(RABBITMQ_EXCHANGE, 'topic', { durable: true });

        // Use durable: false to match your existing server settings
        await chan.assertQueue(queueName, { durable: false });
        await chan.bindQueue(queueName, RABBITMQ_EXCHANGE, RABBITMQ_ROUTING_KEY);

        const payload = typeof message === 'object' ? JSON.stringify(message) : message;

        const options = {
            expiration: '300000',
            contentType: 'application/json'
        };

        chan.publish(RABBITMQ_EXCHANGE, RABBITMQ_ROUTING_KEY, Buffer.from(payload), options);
        console.log(`[✔] Sent to ${queueName}`);
    } catch (error) {
        console.error('Error in sendMessageToQueue:', error.message);
    }
};

module.exports.readMessageFromQueue = async(routingKey, queueName) => {
    try {
        const chan = await getChannel();

        await chan.assertExchange(RABBITMQ_EXCHANGE, 'topic', { durable: true });
        await chan.assertQueue(queueName, { durable: false });
        await chan.bindQueue(queueName, RABBITMQ_EXCHANGE, routingKey);

        // channel.get is for polling. For high volume, consider channel.consume
        const msg = await chan.get(queueName, { noAck: false });

        if (msg) {
            const messageContent = msg.content.toString();
            chan.ack(msg); // Tell RabbitMQ we safely received it
            
            console.log(`[✔] Received from ${queueName}`);
            return messageContent;
        } 
        
        return null;
    } catch (error) {
        console.error("ERROR in readMessageFromQueue:", error);
        throw error;
    }
};

/*
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
*/
