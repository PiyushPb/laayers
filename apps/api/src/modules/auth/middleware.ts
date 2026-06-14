import { Request, Response, NextFunction } from 'express';
import { AuthService } from './services';
import { UnauthorizedError } from '@layers/shared';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies.session_token;
    if (!sessionToken) {
      throw new UnauthorizedError('Authentication required');
    }

    const authData = await AuthService.validateSession(sessionToken);
    if (!authData || !authData.user) {
      throw new UnauthorizedError('Invalid or expired session');
    }

    // Attach user to request
    (req as any).user = authData.user;
    (req as any).session = authData.session;
    
    next();
  } catch (error) {
    next(error);
  }
};
