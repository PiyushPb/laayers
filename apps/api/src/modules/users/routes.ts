import { Router } from 'express';
import { getMe, updateMe, deleteMe, getMyWorkspaces, updateMyAvatar } from './controllers/user.controller';
import { requireAuth } from '../../middlewares/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router: Router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the profile details of the authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         name:
 *                           type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/me', asyncHandler(getMe));

/**
 * @openapi
 * /users/me:
 *   patch:
 *     summary: Update user profile
 *     description: Updates the profile details of the currently authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User updated
 *       401:
 *         description: Unauthorized
 */
router.patch('/me', asyncHandler(updateMe));

/**
 * @openapi
 * /users/me:
 *   delete:
 *     summary: Delete user profile
 *     description: Soft-deletes or deactivates the user account.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User deleted
 *       401:
 *         description: Unauthorized
 */
router.delete('/me', asyncHandler(deleteMe));

/**
 * @openapi
 * /users/me/workspaces:
 *   get:
 *     summary: Get user workspaces summary
 *     description: Returns a list of all workspaces the authenticated user belongs to, including their role in each and which is the currently active workspace context.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of workspaces returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     workspaces:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           slug:
 *                             type: string
 *                           role:
 *                             type: string
 *                           isCurrent:
 *                             type: boolean
 *       401:
 *         description: Unauthorized
 */
router.get('/me/workspaces', asyncHandler(getMyWorkspaces));

/**
 * @openapi
 * /users/me/avatar:
 *   post:
 *     summary: Update profile avatar (Scaffold)
 *     description: Scaffolds the user avatar upload/update flow. Simulates updating and saves the avatar URL in the database.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://avatar.vercel.sh/johndoe
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     avatarUrl:
 *                       type: string
 *                       example: https://avatar.vercel.sh/johndoe
 *       401:
 *         description: Unauthorized
 */
router.post('/me/avatar', asyncHandler(updateMyAvatar));

export default router;
