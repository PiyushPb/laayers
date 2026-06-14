import { Router } from 'express';
import { AuthController } from './controllers';
import { requireAuth } from './middleware';

const router: Router = Router();

// Public routes
router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/exchange-code', AuthController.exchangeCode);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/resend-verification', AuthController.resendVerification);

// Protected routes
router.post('/logout', requireAuth, AuthController.logout);
router.post('/generate-code', requireAuth, AuthController.generateAuthCode);
router.get('/me', requireAuth, AuthController.me);
router.get('/consents', requireAuth, AuthController.getConsents);
router.post('/consents', requireAuth, AuthController.addConsent);
router.patch('/consents', requireAuth, AuthController.addConsent);
router.get('/sessions', requireAuth, AuthController.getUserSessions);
router.delete('/sessions/:id', requireAuth, AuthController.revokeSession);
router.delete('/sessions', requireAuth, AuthController.revokeAllSessions);

export default router;
