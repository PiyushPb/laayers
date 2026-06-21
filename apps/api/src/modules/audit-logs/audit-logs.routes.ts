import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth';
import { requireWorkspace, requireRole } from '../../middlewares/workspace';
import { asyncHandler } from '../../utils/asyncHandler';
import { listAuditLogs, getAuditLog } from './audit-logs.controller';

const router: Router = Router({ mergeParams: true });

router.use(requireAuth);
// Assumes router mounted at /api/v1/workspaces/:workspaceId/audit-logs
router.use(requireWorkspace);
router.use(requireRole(['owner', 'admin']));

router.get('/', asyncHandler(listAuditLogs));
router.get('/:id', asyncHandler(getAuditLog));

export default router;
