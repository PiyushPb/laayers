import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { requestLogger } from './middlewares/requestLogger';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app: express.Application = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.COOKIE_SECRET));

app.use(requestLogger);

import { db } from '@layers/database';
import { sql } from 'drizzle-orm';

// Health check
/**
 * @openapi
 * /health:
 *   get:
 *     summary: API health status
 *     description: Returns the health status of the API application and its database connection.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: API is healthy and connected to the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 uptime:
 *                   type: number
 *                   example: 123.45
 *                 db:
 *                   type: string
 *                   example: connected
 *       503:
 *         description: Database connection failed or service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Database connection failed
 */
app.get('/api/v1/health', async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.status(200).json({ status: 'ok', uptime: process.uptime(), db: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', message: 'Database connection failed' });
  }
});

// API Docs
if (env.NODE_ENV === 'development') {
  app.use(
    '/docs',
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://validator.swagger.io; connect-src 'self'"
      );
      next();
    },
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
}

// API Routes
app.use('/api/v1', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
