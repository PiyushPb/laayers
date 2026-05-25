import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@layers/shared';
import { env } from '../config/env';
import { db, users } from '@layers/database';
import { eq } from 'drizzle-orm';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      workspace?: any;
      member?: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new UnauthorizedError('Please log in to access this resource');
    }

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string };

    const userRecord = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);

    if (!userRecord || userRecord.length === 0) {
      throw new UnauthorizedError('User no longer exists');
    }

    req.user = userRecord[0];
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};
