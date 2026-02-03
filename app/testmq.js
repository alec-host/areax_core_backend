const amqp = require('amqplib');

// Mapping your specific details
const config = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
};

const EXCHANGE_NAME = 'topic_exchange';
// We use a wildcard '#' to capture both invoice.paid and stripe-event.log
// const ROUTING_KEY = 'stripe-event.#'; 

async function consumeStripeEvents() {
    try {
        const connection = await amqp.connect(config);
        const channel = await connection.createChannel();

        // 1. Ensure the exchange exists
        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

        // 2. Create a temporary, private queue for this script
        // exclusive: true means the queue is deleted when the script stops
        const q = await channel.assertQueue('', { exclusive: true });

        console.log(`[*] Waiting for Stripe events in ${q.queue}. To exit press CTRL+C`);

        // 3. Bind the queue to the exchange for our keys
        // You can add multiple bindings to one queue
        const keys = ['invoice.paid', 'subscription.lifecycle.updated', 'subscription.lifecycle.created', 'subscription.lifecycle.delete', 'payment_intent.succeeded'];
        
        for (const key of keys) {
            await channel.bindQueue(q.queue, EXCHANGE_NAME, key);
            console.log(`[+] Bound to key: ${key}`);
        }

        // 4. Consume the messages
        channel.consume(q.queue, (msg) => {
            if (msg.content !== null) {
                const payload = msg.content.toString();
                const routingKey = msg.fields.routingKey;

                console.log("-----------------------------------------");
                console.log(` [x] Received [${routingKey}]`);
                
                try {
                    // Assuming the payload is JSON
                    console.log(JSON.parse(payload));
                } catch (e) {
                    console.log(payload);
                }
            }
        }, { noAck: true });

    } catch (error) {
        console.error("Error in RabbitMQ Consumer:", error);
    }
}

consumeStripeEvents();
