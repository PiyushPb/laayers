import { Router } from 'express';
import { getOverviewMetrics } from './controllers';

const router: Router = Router();

router.get('/overview', getOverviewMetrics);

export default router;
