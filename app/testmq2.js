const amqp = require('amqplib');

const config = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
};

// Update these to match your actual queue names from your RabbitMQ details
const QUEUE_LOGS = 'STRIPE_LOG_CHANNEL';
const QUEUE_PROMPTS = 'STRIPE_PROMPT_CHANNEL';

async function peekQueues() {
    try {
        const connection = await amqp.connect(config);
        const channel = await connection.createChannel();

        // 1. Set prefetch to 1 so we don't grab everything at once
        await channel.prefetch(1);

        console.log(`[*] Checking for unconsumed messages in ${QUEUE_LOGS} and ${QUEUE_PROMPTS}...`);

        const consumeQueue = (queueName) => {
            channel.consume(queueName, (msg) => {
                if (msg !== null) {
                    const content = msg.content.toString();
                    console.log(`\n--- New Message from [${queueName}] ---`);
                    console.log(`Routing Key: ${msg.fields.routingKey}`);
                    
                    try {
                        console.log(JSON.parse(content));
                    } catch (e) {
                        console.log(content);
                    }

                    // IMPORTANT: We use { noAck: false } and we DON'T call channel.ack(msg) 
                    // if we want the message to stay in the queue for the real app to process later.
                    // For now, let's acknowledge them to "clear" the queue:
                    channel.ack(msg);
                }
            }, { noAck: false });
        };

        consumeQueue(QUEUE_LOGS);
        consumeQueue(QUEUE_PROMPTS);

    } catch (error) {
        console.error("Connection Error:", error);
    }
}

peekQueues();
