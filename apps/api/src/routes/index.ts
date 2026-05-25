import { Router } from 'express';
import authRoutes from '../modules/auth/routes';
import userRoutes from '../modules/users/routes';
import workspaceRoutes from '../modules/workspaces/routes';
import invitationRoutes from '../modules/invitations/routes';
import publicRoutes from '../modules/public/routes';
import sdkRoutes from '../modules/sdk/routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/invitations', invitationRoutes);
router.use('/public', publicRoutes);
router.use('/sdk', sdkRoutes);

export default router;
