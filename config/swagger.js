const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'User Management API',
            description: 'API documentation for managing user data',
            version: '1.0.0',
            contact: {
                name: 'Your Name',
                email: 'your.email@example.com'
            }
        },
        servers: [{ url: 'http://localhost:4100' }],
    },
    // Path to the API specs
    apis: ['./routes/*.js'],
};

// Initialize Swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
    // Serve Swagger UI at /api-docs
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
