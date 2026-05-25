import { Router } from 'express';
import { getMe, updateMe, deleteMe } from './controllers/user.controller';
import { requireAuth } from '../../middlewares/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router: Router = Router();

router.use(requireAuth);

router.get('/me', asyncHandler(getMe));
router.patch('/me', asyncHandler(updateMe));
router.delete('/me', asyncHandler(deleteMe));

export default router;
