import { Request, Response } from 'express';
import { sendSuccess } from '@layers/shared';

export const getSdkPlaceholder = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess({ message: 'SDK module placeholder active' }));
};
