import { z } from 'zod';

export const inviteMemberSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    role: z.enum(['admin', 'member', 'viewer']).default('member'),
  }),
});

export const updateMemberRoleSchema = z.object({
  body: z.object({
    role: z.enum(['owner', 'admin', 'member', 'viewer']),
  }),
});

export const updateSettingsSchema = z.object({
  body: z.object({
    branding: z.object({
      logo: z.string().url('Invalid logo URL').optional().nullable(),
      primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color').optional().nullable(),
      accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color').optional().nullable(),
    }).optional().nullable(),
    preferences: z.object({
      timezone: z.string().optional().nullable(),
      language: z.string().optional().nullable(),
    }).optional().nullable(),
  }),
});

export const addDomainSchema = z.object({
  body: z.object({
    domain: z.string().min(1, 'Domain name is required'),
    primary: z.boolean().optional(),
  }),
});

export const updateDomainSchema = z.object({
  body: z.object({
    primary: z.boolean().optional(),
  }),
});
