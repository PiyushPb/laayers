import { Request, Response } from 'express';
import { sendSuccess } from '@layers/shared';

export const getMe = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess({ user: req.user }));
};

export const updateMe = async (req: Request, res: Response) => {
  // TODO: Implement update user logic
  res.status(200).json(sendSuccess(null, 'User updated'));
};

export const deleteMe = async (req: Request, res: Response) => {
  // TODO: Implement delete user logic
  res.status(200).json(sendSuccess(null, 'User deleted'));
};
