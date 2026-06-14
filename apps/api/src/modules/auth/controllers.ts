import { Request, Response, NextFunction } from 'express';
import { AuthService } from './services';
import { signupSchema, loginSchema, exchangeCodeSchema } from './schemas';
import { sendSuccess } from '@layers/shared/src/response/ApiResponse';
import { AppError } from '@layers/shared';

const setCookies = (res: Response, sessionToken: string, refreshToken: string) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };

  res.cookie('session_token', sessionToken, cookieOptions);
  res.cookie('refresh_token', refreshToken, cookieOptions);
};

const clearCookies = (res: Response) => {
  res.clearCookie('session_token');
  res.clearCookie('refresh_token');
};

export const AuthController = {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = signupSchema.parse(req.body);
      const meta = {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      };

      const result = await AuthService.signup(payload, meta);
      setCookies(res, result.sessionToken, result.refreshToken);

      res.json(sendSuccess({ message: 'Signup successful' }));
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = loginSchema.parse(req.body);
      const meta = {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      };

      const result = await AuthService.login(payload, meta);
      setCookies(res, result.sessionToken, result.refreshToken);

      res.json(sendSuccess({ message: 'Login successful' }));
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionToken = req.cookies.session_token;
      if (sessionToken) {
        await AuthService.logout(sessionToken);
      }
      
      clearCookies(res);
      res.json(sendSuccess({ message: 'Logged out successfully' }));
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        throw new AppError('No refresh token provided', 401, 'UNAUTHORIZED');
      }

      const meta = {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      };

      const result = await AuthService.refreshSession(refreshToken, meta);
      setCookies(res, result.sessionToken, result.refreshToken);

      res.json(sendSuccess({ message: 'Session refreshed' }));
    } catch (error) {
      clearCookies(res);
      next(error);
    }
  },

  async generateAuthCode(req: Request, res: Response, next: NextFunction) {
    try {
      // Assuming middleware extracts user to req.user
      const user = (req as any).user;
      if (!user) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      const { clientId, redirectUri } = req.body;
      if (!clientId || !redirectUri) {
        throw new AppError('Client ID and Redirect URI required', 400, 'VALIDATION_ERROR');
      }

      const result = await AuthService.generateAuthCode(user.id, clientId, redirectUri);
      res.json(sendSuccess(result));
    } catch (error) {
      next(error);
    }
  },

  async exchangeCode(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = exchangeCodeSchema.parse(req.body);
      const identity = await AuthService.exchangeAuthCode(payload);

      res.json(sendSuccess({ identity }));
    } catch (error) {
      next(error);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!user) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      res.json(sendSuccess({
        id: user.id,
        email: user.email,
        status: user.status,
      }));
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = import('./schemas').then(m => m.forgotPasswordSchema).then(schema => schema.parse(req.body));
      const { email } = await payload;
      await AuthService.requestPasswordReset(email);
      res.json(sendSuccess({ message: 'If the email exists, a reset link has been sent' }));
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = (await import('./schemas')).resetPasswordSchema;
      const payload = schema.parse(req.body);
      await AuthService.resetPassword(payload);
      res.json(sendSuccess({ message: 'Password reset successful' }));
    } catch (error) {
      next(error);
    }
  },

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = (await import('./schemas')).verifyEmailSchema;
      const payload = schema.parse(req.body);
      await AuthService.verifyEmail(payload);
      res.json(sendSuccess({ message: 'Email verified successfully' }));
    } catch (error) {
      next(error);
    }
  },

  async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = (await import('./schemas')).resendVerificationSchema;
      const payload = schema.parse(req.body);
      await AuthService.resendVerification(payload.email);
      res.json(sendSuccess({ message: 'If the email exists and is unverified, a verification link has been sent' }));
    } catch (error) {
      next(error);
    }
  },

  async getConsents(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const consents = await AuthService.getUserConsents(user.id);
      res.json(sendSuccess(consents));
    } catch (error) {
      next(error);
    }
  },

  async addConsent(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = (await import('./schemas')).consentSchema;
      const payload = schema.parse(req.body);
      const user = (req as any).user;
      const meta = {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      };
      const consent = await AuthService.addUserConsent(user.id, payload, meta);
      res.json(sendSuccess(consent));
    } catch (error) {
      next(error);
    }
  },

  async getUserSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const sessions = await AuthService.getUserSessions(user.id);
      res.json(sendSuccess(sessions));
    } catch (error) {
      next(error);
    }
  },

  async revokeSession(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const sessionId = req.params.id;
      await AuthService.revokeSession(user.id, sessionId);
      res.json(sendSuccess({ message: 'Session revoked' }));
    } catch (error) {
      next(error);
    }
  },

  async revokeAllSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      await AuthService.revokeAllSessions(user.id);
      res.json(sendSuccess({ message: 'All sessions revoked' }));
    } catch (error) {
      next(error);
    }
  }
};
