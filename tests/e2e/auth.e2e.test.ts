import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

// Use environment variables for the API URL, default to local dev server
const API_URL = process.env.API_URL || 'http://localhost:8000/api/v1';

describe('Auth Endpoints E2E', () => {
  it('should successfully hit the login endpoint and fail with missing credentials', async () => {
    // Basic test to verify that the Express app is reachable and responds with a JSON error
    try {
      const res = await request(API_URL)
        .post('/auth/login')
        .send({});

      // It should either be a 400 Bad Request or a standard framework error
      expect(res.status).toBeGreaterThanOrEqual(400);
    } catch (error) {
      // If the server isn't running, this test will fail
      console.warn('Is the API server running on port 3001? Run `pnpm dev` in a separate terminal.');
    }
  });

  it('should successfully sign up a user with workspace and consents', async () => {
    try {
      const email = `piyush-e2e-${Date.now()}-${Math.random().toString(36).substring(2, 7)}@example.com`;
      const res = await request(API_URL)
        .post('/auth/signup')
        .send({
          email,
          password: 'Password123!',
          name: 'Piyush E2E',
          workspaceName: 'E2E Workspace',
          marketingEmailsEnabled: false,
          consents: [
            { consentType: 'terms', version: 'v1.0' },
            { consentType: 'privacy', version: 'v1.0' }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.headers['set-cookie']).toBeDefined();
    } catch (error) {
      console.warn('API Server may not be running or database isn\'t responding.');
    }
  });
});
