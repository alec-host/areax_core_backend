const  promisify = require("util");
const { connectToRedis } = require("../cache/redis");

const incrAsync = promisify(connectToRedis.incr).bind(connectToRedis);
const expireAsync = promisify(connectToRedis.expire).bind(connectToRedis);

const rateLimit = (maxRequests, windowMs) => async (req, res, next) => {
  const ip = req.ip;
  const key = `ratelimit:${ip}:${req.path}`;
  
  const requests = await incrAsync(key);
  if (requests === 1) await expireAsync(key, windowMs/1000);
  
  if (requests > maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests'
    });
  }
  next();
};
