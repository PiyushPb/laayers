import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '@layers/shared';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
};
