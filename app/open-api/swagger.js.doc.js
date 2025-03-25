const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AreaX - Backend APIs',
      version: '1.0.0',
    },
  },
  apis: ['app/routes/app.routes.js'], // Path to the API docs
};

const openapiSpecification = swaggerJSDoc(options);

module.exports = openapiSpecification;