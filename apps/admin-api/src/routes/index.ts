import { Router } from 'express';
import userRoutes from '../modules/users/routes';
import workspaceRoutes from '../modules/workspaces/routes';
import metricsRoutes from '../modules/metrics/routes';

const router: Router = Router();

router.use('/users', userRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/metrics', metricsRoutes);

export default router;
