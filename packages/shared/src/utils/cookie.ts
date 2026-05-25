export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

export const getAccessTokenOptions = () => ({
  ...cookieOptions,
  maxAge: 15 * 60 * 1000, // 15 minutes
});

export const getRefreshTokenOptions = () => ({
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
