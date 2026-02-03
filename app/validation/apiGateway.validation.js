const  { API_GATEWAY_SECRET } = require("../constants/app_constants");

const apiGatewayValidation = (req, res, next) => {
  try {
    const incomingSecret = req.headers["x-gateway-secret"];
    const expectedSecret = API_GATEWAY_SECRET;

    if (!incomingSecret) {
      return res.status(401).json({ message: "Missing Gateway Secret" });
    }

    if (incomingSecret !== expectedSecret) {
      return res.status(401).json({ message: "Invalid Gateway Secret" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Gateway validation error" });
  }
};

module.exports = apiGatewayValidation;
