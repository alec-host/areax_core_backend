const redis = require('redis');

const connectToRedis = async () => {
    const client = redis.createClient({
        url: 'redis://localhost:6379'
    });

    client.on('error', (err) => {
        console.error('Redis Client Error', err);
        return null;
    });

    try{
        await client.connect();
        console.log('Connected to Redis');
        return client;
    }catch(err){
        console.error('Error connecting to Redis', err);
        return null;
    }
};

const closeRedisConnection = async (client) => {
    await client.quit();
    console.log('Disconnected from Redis');
};

const setCache = async (client, key, value, ttl = 86400) => {
    try {
        await client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
        console.error("Error setting cache:", error);
    }
};

const getCache = async (client,key) => {
    try {
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error getting cache:", error);
        return null;
    }
};

const deleteCache = async (client,key) => {
    try {
        await client.del(key);
    } catch (error) {
        console.error("Error deleting cache:", error);
    }
};

module.exports = { connectToRedis, closeRedisConnection, setCache, getCache, deleteCache };
