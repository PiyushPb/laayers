import { Router } from 'express';
import { 
  listWorkspaces, createWorkspace, getWorkspace, updateWorkspace, deleteWorkspace,
  switchWorkspace, getMembers, inviteMember, updateMemberRole, removeMember
} from './controllers/workspace.controller';
import { requireAuth } from '../../middlewares/auth';
import { requireWorkspace, requireRole } from '../../middlewares/workspace';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middlewares/validateRequest';
import { inviteMemberSchema, updateMemberRoleSchema } from './schemas/workspace.schema';

const router: Router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(listWorkspaces));
router.post('/', asyncHandler(createWorkspace));

router.get('/:workspaceId', requireWorkspace, asyncHandler(getWorkspace));
router.patch('/:workspaceId', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(updateWorkspace));
router.delete('/:workspaceId', requireWorkspace, requireRole(['owner']), asyncHandler(deleteWorkspace));
router.post('/:workspaceId/switch', requireWorkspace, asyncHandler(switchWorkspace));

// Members
router.get('/:workspaceId/members', requireWorkspace, asyncHandler(getMembers));
router.post('/:workspaceId/members/invite', requireWorkspace, requireRole(['owner', 'admin']), validateRequest(inviteMemberSchema), asyncHandler(inviteMember));
router.patch('/:workspaceId/members/:memberId', requireWorkspace, requireRole(['owner', 'admin']), validateRequest(updateMemberRoleSchema), asyncHandler(updateMemberRole));
router.delete('/:workspaceId/members/:memberId', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(removeMember));

export default router;
