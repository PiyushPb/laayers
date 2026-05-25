import { Router } from 'express';
import { getPublicPlaceholder } from './controllers/public.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router: Router = Router();

router.get('/placeholder', asyncHandler(getPublicPlaceholder));

export default router;
