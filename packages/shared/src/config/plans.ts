export type CorePlanLimits = {
  maxMembers: number;
  maxStorageMb: number;
};

export type BlogsPlanLimits = {
  maxBlogs: number;
};

export type ChatsPlanLimits = {
  maxChats: number;
};

export type PlanConfig<T> = {
  name: string;
  limits: T;
};

export const PLANS_CONFIG = {
  core: {
    free: { name: 'Free', limits: { maxMembers: 5, maxStorageMb: 500 } },
    hobby: { name: 'Hobby', limits: { maxMembers: 10, maxStorageMb: 2000 } },
    starter: { name: 'Starter', limits: { maxMembers: 20, maxStorageMb: 5000 } },
    pro: { name: 'Pro', limits: { maxMembers: 50, maxStorageMb: 20000 } },
    enterprise: { name: 'Enterprise', limits: { maxMembers: 1000, maxStorageMb: 100000 } },
    custom: { name: 'Custom', limits: { maxMembers: 5, maxStorageMb: 500 } },
  } as Record<string, PlanConfig<CorePlanLimits>>,
  
  blogs: {
    free: { name: 'Free', limits: { maxBlogs: 1 } },
    pro: { name: 'Pro', limits: { maxBlogs: 100 } },
    custom: { name: 'Custom', limits: { maxBlogs: 1 } },
  } as Record<string, PlanConfig<BlogsPlanLimits>>,

  chat: {
    free: { name: 'Free', limits: { maxChats: 1000 } },
    premium: { name: 'Premium', limits: { maxChats: 100000 } },
    custom: { name: 'Custom', limits: { maxChats: 1000 } },
  } as Record<string, PlanConfig<ChatsPlanLimits>>,
} as const;

