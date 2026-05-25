import { Router } from 'express';
import {
  register, login, refresh, logout, getSession, forgotPassword, resetPassword, verifyEmail, resendVerification,
  listSessions, revokeSession, logoutAll, checkEmail
} from './controllers/auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/auth';
import { authLimiter } from '../../middlewares/rateLimiter';
import {
  registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, resendVerificationSchema,
  checkEmailSchema
} from './schemas/auth.schema';
import { asyncHandler } from '../../utils/asyncHandler';

const router: Router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account, registers a default tenant/workspace, and sends a verification email.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: securepassword123
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                   example: User registered successfully. Please check your email to verify your account.
 *       400:
 *         description: Validation or business logic error
 *       429:
 *         description: Too many requests
 */
router.post('/register', authLimiter, validateRequest(registerSchema), asyncHandler(register));

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in to the application
 *     description: Authenticates user credentials and sets HttpOnly cookies for accessToken and refreshToken.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         headers:
 *           Set-Cookie:
 *             description: Sets cookies accessToken and refreshToken
 *             schema:
 *               type: string
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
 *                           example: usr_12345
 *                         email:
 *                           type: string
 *                           example: user@example.com
 *                         name:
 *                           type: string
 *                           example: John Doe
 *       400:
 *         description: Invalid credentials or validation error
 *       429:
 *         description: Too many requests
 */
router.post('/login', authLimiter, validateRequest(loginSchema), asyncHandler(login));

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh authentication tokens
 *     description: Detects the refreshToken from cookies, issues new tokens, and resets the cookies.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Tokens successfully refreshed
 *         headers:
 *           Set-Cookie:
 *             description: Sets updated accessToken and refreshToken cookies
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', asyncHandler(refresh));

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out of the application
 *     description: Clears all authentication cookies and revokes the active session database entry.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 */
router.post('/logout', asyncHandler(logout));

/**
 * @openapi
 * /auth/session:
 *   get:
 *     summary: Get current session details
 *     description: Retrieves details of the authenticated user's current session. Requires a valid accessToken cookie.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Active session details
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
 *                     session:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         workspaceId:
 *                           type: string
 *       401:
 *         description: Unauthorized (missing or invalid cookie)
 */
router.get('/session', requireAuth, asyncHandler(getSession));

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     description: Sends a password reset email link containing a secure token if the email address exists.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email request processed
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
 *                   example: If that email exists, a password reset link has been sent.
 */
router.post('/forgot-password', authLimiter, validateRequest(forgotPasswordSchema), asyncHandler(forgotPassword));

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Updates the user's password using a valid reset token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 example: reset_token_from_email_here
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: newsecurepassword123
 *     responses:
 *       200:
 *         description: Password successfully reset
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
 *                   example: Password has been successfully reset.
 *       400:
 *         description: Invalid/expired token or validation error
 */
router.post('/reset-password', validateRequest(resetPasswordSchema), asyncHandler(resetPassword));

/**
 * @openapi
 * /auth/verify-email:
 *   post:
 *     summary: Verify email address
 *     description: Marks the user's email address as verified using a valid verification token.
 *     tags:
 *       - Auth
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
 *                 example: verification_token_from_email_here
 *     responses:
 *       200:
 *         description: Email successfully verified
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
 *                   example: Email has been verified successfully.
 *       400:
 *         description: Invalid or expired token
 */
router.post('/verify-email', validateRequest(verifyEmailSchema), asyncHandler(verifyEmail));

/**
 * @openapi
 * /auth/resend-verification:
 *   post:
 *     summary: Resend email verification
 *     description: Resends the verification link email if the user exists and is not already verified.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Request processed
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
 *                   example: Verification link has been resent if the email is registered and unverified.
 */
router.post('/resend-verification', authLimiter, validateRequest(resendVerificationSchema), asyncHandler(resendVerification));

/**
 * @openapi
 * /auth/sessions:
 *   get:
 *     summary: List active user sessions
 *     description: Returns a list of all active sessions for the currently authenticated user, including IPs, user agents, and creation/expiration timestamps.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Sessions listed successfully
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
 *                     sessions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           ipAddress:
 *                             type: string
 *                           userAgent:
 *                             type: string
 *                           expiresAt:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                           isCurrent:
 *                             type: boolean
 *       401:
 *         description: Unauthorized
 */
router.get('/sessions', requireAuth, asyncHandler(listSessions));

/**
 * @openapi
 * /auth/sessions/{sessionId}:
 *   delete:
 *     summary: Revoke an active session
 *     description: Revokes the specified database session by ID, invalidating its refresh capability.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID to revoke
 *     responses:
 *       200:
 *         description: Session revoked successfully
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
 *                   example: Session revoked
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */
router.delete('/sessions/:sessionId', requireAuth, asyncHandler(revokeSession));

/**
 * @openapi
 * /auth/logout-all:
 *   post:
 *     summary: Revoke all other sessions
 *     description: Revokes all active database sessions for the authenticated user, EXCEPT for the session tied to the current access token.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All other sessions revoked successfully
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
 *                   example: All other sessions logged out
 *       401:
 *         description: Unauthorized
 */
router.post('/logout-all', requireAuth, asyncHandler(logoutAll));

/**
 * @openapi
 * /auth/check-email:
 *   post:
 *     summary: Check if email is registered
 *     description: Validates whether a specific email address is already registered in the application database.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: checkuser@example.com
 *     responses:
 *       200:
 *         description: Checking status returned successfully
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
 *                     registered:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Validation error
 */
router.post('/check-email', validateRequest(checkEmailSchema), asyncHandler(checkEmail));

export default router;
