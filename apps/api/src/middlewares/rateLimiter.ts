import rateLimit from 'express-rate-limit';
import { sendError } from '@layers/shared';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json(sendError('RATE_LIMIT_EXCEEDED', 'Too many requests, please try again later.'));
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login/register requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json(sendError('RATE_LIMIT_EXCEEDED', 'Too many authentication attempts, please try again later.'));
  },
});
