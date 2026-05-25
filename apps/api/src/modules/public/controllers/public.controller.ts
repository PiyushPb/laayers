import { Request, Response } from 'express';
import { sendSuccess } from '@layers/shared';

export const getPublicPlaceholder = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess({ message: 'Public module placeholder active' }));
};
