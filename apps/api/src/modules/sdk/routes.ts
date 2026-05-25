import { Router } from 'express';
import { getSdkPlaceholder } from './controllers/sdk.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router: Router = Router();

router.get('/placeholder', asyncHandler(getSdkPlaceholder));

export default router;
