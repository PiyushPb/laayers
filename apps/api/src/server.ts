import app from './app';
import { env } from './config/env';
import { logger } from '@layers/logger';

const port = env.PORT || 8000;

const server = app.listen(port, () => {
  logger.info(`🚀 Server running on port ${port} in ${env.NODE_ENV} mode`);
  console.log(`\n\n✅ SERVER STARTED SUCCESSFULLY ON PORT ${port} ✅\n\n`);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection! Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});
