import { Router } from 'express';
import { getInvitation, acceptInvitation, rejectInvitation } from './controllers/invitation.controller';
import { requireAuth } from '../../middlewares/auth';
import { asyncHandler } from '../../utils/asyncHandler';

const router: Router = Router();

/**
 * @openapi
 * /invitations/{token}:
 *   get:
 *     summary: Get invitation details
 *     description: Retrieves details of an invitation (such as workspace name and inviter name) using the token. Does not require authentication.
 *     tags:
 *       - Invitations
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique invitation token
 *     responses:
 *       200:
 *         description: Invitation details retrieved successfully
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
 *                     invitation:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                         workspaceName:
 *                           type: string
 *       404:
 *         description: Invitation not found or already accepted/rejected/expired
 */
// Get invitation details (does not require auth)
router.get('/:token', asyncHandler(getInvitation));

/**
 * @openapi
 * /invitations/accept:
 *   post:
 *     summary: Accept workspace invitation
 *     description: Accepts a workspace invitation using the token. The user must be authenticated.
 *     tags:
 *       - Invitations
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: invitation_token_here
 *     responses:
 *       200:
 *         description: Invitation accepted successfully
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
 *                   example: Invitation accepted successfully. You have joined the workspace.
 *       400:
 *         description: Invalid/expired token or email mismatch
 *       401:
 *         description: Unauthorized
 */
// Accepting/Rejecting requires user to be logged in
router.post('/accept', requireAuth, asyncHandler(acceptInvitation));

/**
 * @openapi
 * /invitations/reject:
 *   post:
 *     summary: Reject workspace invitation
 *     description: Rejects a workspace invitation using the token. The user must be authenticated.
 *     tags:
 *       - Invitations
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: invitation_token_here
 *     responses:
 *       200:
 *         description: Invitation rejected successfully
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
 *                   example: Invitation rejected.
 *       400:
 *         description: Invalid/expired token or email mismatch
 *       401:
 *         description: Unauthorized
 */
router.post('/reject', requireAuth, asyncHandler(rejectInvitation));

export default router;
