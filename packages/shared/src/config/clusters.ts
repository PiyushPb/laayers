export const CORE_QUOTAS = ['members', 'storageMb'] as const;

export const CLUSTERS_CONFIG = {
  blogs: {
    id: 'blogs',
    quotas: ['blogs'], // maps to maxBlogs / blogs consumption
  },
  chat: {
    id: 'chat',
    quotas: ['chats'], // maps to maxChats / chats consumption
  },
} as const;

export type ClusterId = keyof typeof CLUSTERS_CONFIG;
export const ALLOWED_MODULES = Object.keys(CLUSTERS_CONFIG) as ClusterId[];
