import { Router } from 'express';
import { getInvitation, acceptInvitation, rejectInvitation } from './controllers/invitation.controller';
import { requireAuth } from '../../middlewares/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router: Router = Router();

// Get invitation details (does not require auth)
router.get('/:token', asyncHandler(getInvitation));

// Accepting/Rejecting requires user to be logged in
router.post('/accept', requireAuth, asyncHandler(acceptInvitation));
router.post('/reject', requireAuth, asyncHandler(rejectInvitation));

export default router;
