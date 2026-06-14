import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock postgres module so it never attempts real connection
vi.mock('postgres', () => {
  const mockQuery = vi.fn().mockResolvedValue([]);
  const mockClient = vi.fn().mockReturnValue(mockQuery);
  return {
    default: mockClient,
  };
});

// Hoist mockDb and mockTx so they can be referenced inside vi.mock factory functions
const { mockDb, mockTx } = vi.hoisted(() => {
  const mockTx = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn().mockImplementation((cb) => cb(mockTx)),
  };

  return { mockDb, mockTx };
});

vi.mock('@layers/database', () => ({
  db: mockDb,
  users: { id: 'users' },
  userConsents: { id: 'userConsents' },
  workspaces: { id: 'workspaces' },
  workspaceMembers: { id: 'workspaceMembers' },
  authSessions: { id: 'authSessions' },
  loginAttempts: { id: 'loginAttempts' },
}));

vi.mock('../../packages/database/dist/index.js', () => ({
  db: mockDb,
  users: { id: 'users' },
  userConsents: { id: 'userConsents' },
  workspaces: { id: 'workspaces' },
  workspaceMembers: { id: 'workspaceMembers' },
  authSessions: { id: 'authSessions' },
  loginAttempts: { id: 'loginAttempts' },
}));

// We also mock the Repository to avoid calling it directly during unit tests
vi.mock('../../apps/api/src/modules/auth/repositories', () => ({
  AuthRepository: {
    getUserByEmail: vi.fn(),
    createUser: vi.fn(),
    createSession: vi.fn(),
    updateUser: vi.fn(),
    createLoginAttempt: vi.fn(),
  }
}));

import { AuthService } from '../../apps/api/src/modules/auth/services';

const createChainedMock = (finalValue: any) => {
  const mock: any = {};
  mock.select = vi.fn().mockReturnValue(mock);
  mock.insert = vi.fn().mockReturnValue(mock);
  mock.update = vi.fn().mockReturnValue(mock);
  mock.delete = vi.fn().mockReturnValue(mock);
  mock.from = vi.fn().mockReturnValue(mock);
  mock.where = vi.fn().mockReturnValue(mock);
  mock.limit = vi.fn().mockReturnValue(mock);
  mock.values = vi.fn().mockReturnValue(mock);
  mock.set = vi.fn().mockReturnValue(mock);
  mock.returning = vi.fn().mockResolvedValue(finalValue);
  const then = (onfulfilled: any) => Promise.resolve(finalValue).then(onfulfilled);
  mock.then = then;
  return mock;
};

describe('AuthService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signup', () => {
    it('should successfully register a user and create a workspace inside a transaction', async () => {
      // Mock db.transaction to run
      mockDb.transaction.mockImplementation(async (cb) => cb(mockTx));

      // 1. mock select existing email -> empty list
      mockTx.select.mockReturnValueOnce(createChainedMock([]));

      // 2. mock user insert
      const mockUser = { id: 'user-cuid', email: 'test@example.com', name: 'Piyush' };
      mockTx.insert.mockReturnValueOnce(createChainedMock([mockUser])); // users table

      // 3. mock consents insert
      mockTx.insert.mockReturnValueOnce(createChainedMock([])); // consents table

      // 4. mock workspaces slug select check -> empty list (no slug conflicts)
      mockTx.select.mockReturnValueOnce(createChainedMock([]));

      // 5. mock workspace insert
      const mockWorkspace = { id: 'workspace-cuid', slug: 'my-workspace' };
      mockTx.insert.mockReturnValueOnce(createChainedMock([mockWorkspace])); // workspaces table

      // 6. mock workspaceMembers insert
      mockTx.insert.mockReturnValueOnce(createChainedMock([])); // workspace_members table

      // 7. mock session insert (outside transaction via createSession)
      mockDb.insert.mockReturnValueOnce(createChainedMock([{ id: 'session-cuid' }]));

      const payload = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Piyush',
        workspaceName: 'My Workspace',
        marketingEmailsEnabled: true,
        consents: [
          { consentType: 'terms' as const, version: 'v1.0' },
          { consentType: 'privacy' as const, version: 'v1.0' }
        ],
      };

      const result = await AuthService.signup(payload, { ipAddress: '127.0.0.1', userAgent: 'test-agent' });

      expect(result).toBeDefined();
      expect(result.sessionToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should fail registration if email is already in use', async () => {
      mockDb.transaction.mockImplementation(async (cb) => cb(mockTx));

      // Mock select existing email -> returns user
      mockTx.select.mockReturnValueOnce(createChainedMock([{ id: 'user-1' }]));

      const payload = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Piyush',
        workspaceName: 'My Workspace',
        marketingEmailsEnabled: true,
        consents: [{ consentType: 'terms' as const, version: 'v1.0' }],
      };

      await expect(AuthService.signup(payload, {})).rejects.toThrow('Email already in use');
    });
  });
});
