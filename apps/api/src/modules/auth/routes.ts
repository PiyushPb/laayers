import { Router } from 'express';
import { register, login, refresh, logout, getSession, forgotPassword, resetPassword, verifyEmail, resendVerification } from './controllers/auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/auth';
import { authLimiter } from '../../middlewares/rateLimiter';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, resendVerificationSchema } from './schemas/auth.schema';
import { asyncHandler } from '../../utils/asyncHandler';

const router: Router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), asyncHandler(register));
router.post('/login', authLimiter, validateRequest(loginSchema), asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));
router.post('/logout', asyncHandler(logout));
router.get('/session', requireAuth, asyncHandler(getSession));

router.post('/forgot-password', authLimiter, validateRequest(forgotPasswordSchema), asyncHandler(forgotPassword));
router.post('/reset-password', validateRequest(resetPasswordSchema), asyncHandler(resetPassword));
router.post('/verify-email', validateRequest(verifyEmailSchema), asyncHandler(verifyEmail));
router.post('/resend-verification', authLimiter, validateRequest(resendVerificationSchema), asyncHandler(resendVerification));

export default router;
