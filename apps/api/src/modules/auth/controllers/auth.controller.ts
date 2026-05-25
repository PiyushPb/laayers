import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, getAccessTokenOptions, getRefreshTokenOptions } from '@layers/shared';

export const register = async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  res.status(201).json(sendSuccess({ user: { id: result.user.id, email: result.user.email } }, 'Registration successful. Please check your email to verify your account.'));
};

export const login = async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await AuthService.login(req.body, req.ip || '', req.headers['user-agent'] || '');

  res.cookie('accessToken', accessToken, getAccessTokenOptions());
  res.cookie('refreshToken', refreshToken, getRefreshTokenOptions());

  res.status(200).json(sendSuccess({ accessToken }, 'Login successful'));
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  const { accessToken, refreshToken } = await AuthService.refreshSession(token);

  res.cookie('accessToken', accessToken, getAccessTokenOptions());
  res.cookie('refreshToken', refreshToken, getRefreshTokenOptions());

  res.status(200).json(sendSuccess({ accessToken }, 'Token refreshed'));
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  await AuthService.logout(token);

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json(sendSuccess(null, 'Logged out successfully'));
};

export const getSession = async (req: Request, res: Response) => {
  res.status(200).json(sendSuccess({ user: req.user }));
};

export const forgotPassword = async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body.email);
  res.status(200).json(sendSuccess(null, 'If that email exists, a password reset link has been sent.'));
};

export const resetPassword = async (req: Request, res: Response) => {
  await AuthService.resetPassword(req.body.token, req.body.password);
  res.status(200).json(sendSuccess(null, 'Password has been reset successfully. Please log in.'));
};

export const verifyEmail = async (req: Request, res: Response) => {
  await AuthService.verifyEmail(req.body.token);
  res.status(200).json(sendSuccess(null, 'Email verified successfully.'));
};

export const resendVerification = async (req: Request, res: Response) => {
  await AuthService.resendVerification(req.body.email);
  res.status(200).json(sendSuccess(null, 'If that email exists and is not verified, a new link has been sent.'));
};
