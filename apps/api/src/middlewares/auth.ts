import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@layers/shared';
import { AuthService } from '../modules/auth/services';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      workspace?: any;
      member?: any;
      sessionId?: string;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.session_token) {
      token = req.cookies.session_token;
    }

    if (!token) {
      throw new UnauthorizedError('Please log in to access this resource');
    }

    const validationResult = await AuthService.validateSession(token);

    if (!validationResult) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    req.user = validationResult.user;
    req.sessionId = validationResult.session.id;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};
