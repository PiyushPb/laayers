import { Request, Response, NextFunction } from 'express';
import { db, users } from '@layers/database';
import { eq, desc } from 'drizzle-orm';
import { sendSuccess, NotFoundError, ValidationError } from '@layers/shared';

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const usersList = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        status: users.status,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    res.status(200).json(sendSuccess({ users: usersList, page, limit }));
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.params.id)).limit(1);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    res.status(200).json(sendSuccess({ user }));
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended', 'banned'].includes(status)) {
      throw new ValidationError('Invalid status. Must be active, suspended, or banned.');
    }

    const [user] = await db
      .update(users)
      .set({ status })
      .where(eq(users.id, req.params.id))
      .returning();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json(sendSuccess({ user }));
  } catch (err) {
    next(err);
  }
};
