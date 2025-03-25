const https = require("https");

module.exports.getImageAsBase64 = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const data = [];

      res.on('data', (chunk) => {
        data.push(chunk);
      });

      res.on('end', () => {
        const buffer = Buffer.concat(data);
        const base64Image = buffer.toString('base64');
        resolve(base64Image);
      });

      res.on('error', (err) => {
        reject(err);
      });
    });
  });
};
