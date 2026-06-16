import { Request, Response, NextFunction } from 'express';
import { AppError, sendError } from '@layers/shared';
import { logger } from '@layers/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(sendError(err.code, err.message));
    return;
  }

  // Log unexpected errors
  logger.error('Unexpected Error:', err);

  res.status(500).json(sendError('INTERNAL_ERROR', 'An unexpected error occurred'));
};
