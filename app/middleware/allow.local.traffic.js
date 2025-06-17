module.exports.allowLocalTraffic = (allowedIP, allowedPort) => {
    return (req, res, next) => {
        const requestIP = req.socket.remoteAddress;
        const requestPort = req.socket.localPort;

        if(requestIP.startsWith("::ffff:")) {
            requestIP = requestIP.split("::ffff:")[1]; // Extract actual IPv4
        } 

        if (requestIP !== allowedIP || requestPort !== allowedPort) {
            return res.status(403).json({ success: false, error: true, message: "Access denied: Local server traffic only." });
        }
        next();
    };
};
