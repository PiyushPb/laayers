import { Router } from 'express';
import { listWorkspaces, getWorkspace, updateWorkspaceQuotas, updateWorkspaceModules, deleteWorkspace } from './controllers';

const router: Router = Router();

router.get('/', listWorkspaces);
router.get('/:id', getWorkspace);
router.patch('/:id/quotas', updateWorkspaceQuotas);
router.patch('/:id/modules', updateWorkspaceModules);
router.delete('/:id', deleteWorkspace);

export default router;
