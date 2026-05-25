import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Layers API Documentation',
      version: '1.0.0',
      description: 'Production-ready modular monolith API endpoints for Layers SaaS platform.',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API Gateway',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'accessToken',
          description: 'Access Token cookie used for authenticated endpoints',
        },
      },
    },
  },
  // Using path.join with __dirname guarantees it works regardless of CWD
  apis: [
    path.join(__dirname, '../app.ts'),
    path.join(__dirname, '../modules/*/routes.ts'),
    path.join(__dirname, '../modules/**/*.ts'),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
