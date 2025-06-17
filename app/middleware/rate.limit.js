
const { connectToRedis } = require("../cache/redis");

const incrAsync = async(key) => await connectToRedis.incr(connectToRedis);
const expireAsync = async(key,time) => await connectToRedis.expire(key,time);

module.exports.rateLimit = (maxRequests, windowMs) => async (req, res, next) => {
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
