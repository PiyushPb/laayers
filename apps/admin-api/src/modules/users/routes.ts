import { Router } from 'express';
import { listUsers, getUser, updateUserStatus } from './controllers';

const router: Router = Router();

router.get('/', listUsers);
router.get('/:id', getUser);
router.patch('/:id/status', updateUserStatus);

export default router;
