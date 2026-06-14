import * as argon2 from 'argon2';
import crypto from 'crypto';

export const CryptoUtils = {
  // Password hashing
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, { type: argon2.argon2id });
  },

  async verifyPassword(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  },

  // Token generation
  generateSecureToken(length: number = 64): string {
    return crypto.randomBytes(length).toString('hex');
  },

  // Token hashing (for storage)
  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  },
};
