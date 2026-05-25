import { Router } from 'express';
import authRoutes from '../modules/auth/routes';
import userRoutes from '../modules/users/routes';
import workspaceRoutes from '../modules/workspaces/routes';
import invitationRoutes from '../modules/invitations/routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/invitations', invitationRoutes);

export default router;
