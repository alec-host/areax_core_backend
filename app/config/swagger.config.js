const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Project W Core APIs',
            version: '1.0.0',
            description: 'Core Backend API Documentation',
        },
        servers: [
            {
                url: '/api/v1',
                description: 'Primary API Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
                basicAuth: {
                    type: 'http',
                    scheme: 'basic',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: { type: 'boolean', example: true },
                        message: { type: 'string' },
                    },
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        error: { type: 'boolean', example: false },
                        data: { type: 'object' }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    // Using relative path string for Windows compatibility as seen in previous repo
    apis: ['./app/docs/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
