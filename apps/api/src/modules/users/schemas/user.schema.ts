import { z } from 'zod';

export const updateMeSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
  }),
});

export const updateAvatarSchema = z.object({
  body: z.object({
    avatarUrl: z.string().url('Invalid avatar URL'),
  }),
});

export const paginationQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().default('1').transform(Number),
    limit: z.string().regex(/^\d+$/).optional().default('10').transform(Number),
  }),
});
