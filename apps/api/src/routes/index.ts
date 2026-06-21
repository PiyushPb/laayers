import { Router } from 'express';
import authRoutes from '../modules/auth/routes';
import userRoutes from '../modules/users/routes';
import workspaceRoutes from '../modules/workspaces/routes';
import invitationRoutes from '../modules/invitations/routes';
import publicRoutes from '../modules/public/routes';
import sdkRoutes from '../modules/sdk/routes';

import billingRoutes from '../modules/billing/billing.routes';
import auditLogRoutes from '../modules/audit-logs/audit-logs.routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/invitations', invitationRoutes);
router.use('/public', publicRoutes);
router.use('/sdk', sdkRoutes);

// New Modules
router.use('/workspaces/:workspaceId/billing', billingRoutes);
router.use('/workspaces/:workspaceId/audit-logs', auditLogRoutes);

export default router;
