import { Router } from 'express';
import { 
  listWorkspaces, createWorkspace, getWorkspace, updateWorkspace, deleteWorkspace,
  switchWorkspace, getMembers, inviteMember, updateMemberRole, removeMember, transferOwnership
} from './controllers/workspace.controller';
import { getSettings, updateSettings } from './controllers/settings.controller';
import { listDomains, addDomain, updateDomain, deleteDomain, verifyDomain } from './controllers/domains.controller';
import { getSdkKeys, rotateSdkKeys } from './controllers/sdk-keys.controller';
import { listModules, updateModule } from './controllers/modules.controller';
import { getQuotas } from './controllers/quotas.controller';
import { revokeInvitation, resendInvitation } from './controllers/invitation.controller';
import { requireAuth } from '../../middlewares/auth';
import { requireWorkspace, requireRole } from '../../middlewares/workspace';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middlewares/validateRequest';
import { 
  inviteMemberSchema, updateMemberRoleSchema, updateSettingsSchema, addDomainSchema, updateDomainSchema 
} from './schemas/workspace.schema';

const router: Router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /workspaces:
 *   get:
 *     summary: List user workspaces
 *     description: Returns a list of all workspaces the authenticated user belongs to.
 *     tags:
 *       - Workspaces
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of workspaces retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     workspaces:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           slug:
 *                             type: string
 *                           role:
 *                             type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/', asyncHandler(listWorkspaces));

/**
 * @openapi
 * /workspaces:
 *   post:
 *     summary: Create a new workspace
 *     description: Creates a new workspace and sets the user as the owner.
 *     tags:
 *       - Workspaces
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: My New Company
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     workspace:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         slug:
 *                           type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', asyncHandler(createWorkspace));

/**
 * @openapi
 * /workspaces/{workspaceId}:
 *   get:
 *     summary: Get workspace details
 *     description: Retrieves details for a specific workspace. User must belong to the workspace.
 *     tags:
 *       - Workspaces
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Workspace details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     workspace:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         slug:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not a member of the workspace)
 *       404:
 *         description: Workspace not found
 */
router.get('/:workspaceId', requireWorkspace, asyncHandler(getWorkspace));

/**
 * @openapi
 * /workspaces/{workspaceId}:
 *   patch:
 *     summary: Update workspace details
 *     description: Updates a workspace's settings. User must be an owner or admin of the workspace.
 *     tags:
 *       - Workspaces
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Company Name
 *     responses:
 *       200:
 *         description: Workspace updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient roles)
 */
router.patch('/:workspaceId', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(updateWorkspace));

/**
 * @openapi
 * /workspaces/{workspaceId}:
 *   delete:
 *     summary: Delete a workspace
 *     description: Deletes/archives a workspace. User must be the owner of the workspace.
 *     tags:
 *       - Workspaces
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Workspace deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Workspace deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (insufficient roles, owners only)
 */
router.delete('/:workspaceId', requireWorkspace, requireRole(['owner']), asyncHandler(deleteWorkspace));

/**
 * @openapi
 * /workspaces/{workspaceId}/switch:
 *   post:
 *     summary: Switch active workspace context
 *     description: Updates the session context to point to this active workspace, refreshing cookies.
 *     tags:
 *       - Workspaces
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Successfully switched workspace context
 *         headers:
 *           Set-Cookie:
 *             description: Updates accessToken and refreshToken cookies with new workspace context
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/:workspaceId/switch', requireWorkspace, asyncHandler(switchWorkspace));

// Members

/**
 * @openapi
 * /workspaces/{workspaceId}/members:
 *   get:
 *     summary: List workspace members
 *     description: Retrieves a list of all users/members in the specified workspace.
 *     tags:
 *       - Workspace Members
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Members list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     members:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           memberId:
 *                             type: string
 *                           role:
 *                             type: string
 *                           user:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/:workspaceId/members', requireWorkspace, asyncHandler(getMembers));

/**
 * @openapi
 * /workspaces/{workspaceId}/members/invite:
 *   post:
 *     summary: Invite a new member
 *     description: Generates an invitation and sends an email to the invitee. User must be an owner or admin.
 *     tags:
 *       - Workspace Members
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: invitee@example.com
 *               role:
 *                 type: string
 *                 enum: [admin, member, viewer]
 *                 default: member
 *                 example: member
 *     responses:
 *       201:
 *         description: Invitation sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Invitation sent successfully.
 *       400:
 *         description: Validation or business logic error (e.g. user already a member)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/:workspaceId/members/invite', requireWorkspace, requireRole(['owner', 'admin']), validateRequest(inviteMemberSchema), asyncHandler(inviteMember));

/**
 * @openapi
 * /workspaces/{workspaceId}/members/{memberId}:
 *   patch:
 *     summary: Update workspace member role
 *     description: Updates a member's access level role. User must be an owner or admin of the workspace.
 *     tags:
 *       - Workspace Members
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the member to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [owner, admin, member, viewer]
 *                 example: admin
 *     responses:
 *       200:
 *         description: Member role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Member role updated successfully.
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.patch('/:workspaceId/members/:memberId', requireWorkspace, requireRole(['owner', 'admin']), validateRequest(updateMemberRoleSchema), asyncHandler(updateMemberRole));

/**
 * @openapi
 * /workspaces/{workspaceId}/members/{memberId}:
 *   delete:
 *     summary: Remove member from workspace
 *     description: Removes a member's access to the workspace. User must be an owner or admin of the workspace.
 *     tags:
 *       - Workspace Members
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the member to remove
 *     responses:
 *       200:
 *         description: Member removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Member removed successfully.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/:workspaceId/members/:memberId', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(removeMember));

// Settings
/**
 * @openapi
 * /workspaces/{workspaceId}/settings:
 *   get:
 *     summary: Get workspace settings
 *     description: Retrieves the branding and preferences configuration of the workspace. Only owners and admins allowed.
 *     tags:
 *       - Workspace Settings
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     settings:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/:workspaceId/settings', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(getSettings));

/**
 * @openapi
 * /workspaces/{workspaceId}/settings:
 *   patch:
 *     summary: Update workspace settings
 *     description: Updates the branding and preferences configurations of the workspace. Includes logo, color themes, timezone, and language. Only owners and admins allowed.
 *     tags:
 *       - Workspace Settings
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branding:
 *                 type: object
 *                 properties:
 *                   logo:
 *                     type: string
 *                     format: uri
 *                   primaryColor:
 *                     type: string
 *                   accentColor:
 *                     type: string
 *               preferences:
 *                 type: object
 *                 properties:
 *                   timezone:
 *                     type: string
 *                     example: UTC
 *                   language:
 *                     type: string
 *                     example: en
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.patch('/:workspaceId/settings', requireWorkspace, requireRole(['owner', 'admin']), validateRequest(updateSettingsSchema), asyncHandler(updateSettings));

// Domains
/**
 * @openapi
 * /workspaces/{workspaceId}/domains:
 *   get:
 *     summary: List workspace custom domains
 *     description: Returns all domains registered to this workspace. Any workspace member can list.
 *     tags:
 *       - Workspace Domains
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Domains retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     domains:
 *                       type: array
 */
router.get('/:workspaceId/domains', requireWorkspace, asyncHandler(listDomains));

/**
 * @openapi
 * /workspaces/{workspaceId}/domains:
 *   post:
 *     summary: Add custom domain
 *     description: Registers a new custom domain for the workspace. Normalizes the domain and checks global uniqueness. Only owners and admins allowed.
 *     tags:
 *       - Workspace Domains
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - domain
 *             properties:
 *               domain:
 *                 type: string
 *                 example: custom.mycompany.com
 *               primary:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Domain added successfully
 *       400:
 *         description: Validation error or domain already registered globally
 */
router.post('/:workspaceId/domains', requireWorkspace, requireRole(['owner', 'admin']), validateRequest(addDomainSchema), asyncHandler(addDomain));

/**
 * @openapi
 * /workspaces/{workspaceId}/domains/{domainId}:
 *   patch:
 *     summary: Update custom domain configuration
 *     description: Updates properties of a custom domain. When setting primary to true, demotes other domains of the workspace to primary=false. Only owners and admins allowed.
 *     tags:
 *       - Workspace Domains
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *       - in: path
 *         name: domainId
 *         required: true
 *         schema:
 *           type: string
 *         description: The domain ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               primary:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Domain updated successfully
 */
router.patch('/:workspaceId/domains/:domainId', requireWorkspace, requireRole(['owner', 'admin']), validateRequest(updateDomainSchema), asyncHandler(updateDomain));

/**
 * @openapi
 * /workspaces/{workspaceId}/domains/{domainId}:
 *   delete:
 *     summary: Delete custom domain
 *     description: Removes a registered custom domain from the workspace. Only owners and admins allowed.
 *     tags:
 *       - Workspace Domains
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *       - in: path
 *         name: domainId
 *         required: true
 *         schema:
 *           type: string
 *         description: The domain ID
 *     responses:
 *       200:
 *         description: Domain deleted successfully
 */
router.delete('/:workspaceId/domains/:domainId', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(deleteDomain));

/**
 * @openapi
 * /workspaces/{workspaceId}/domains/{domainId}/verify:
 *   post:
 *     summary: Verify custom domain ownership
 *     description: Triggers verification flow scaffold, validating TXT/DNS config and setting verified to true. Only owners and admins allowed.
 *     tags:
 *       - Workspace Domains
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *       - in: path
 *         name: domainId
 *         required: true
 *         schema:
 *           type: string
 *         description: The domain ID
 *     responses:
 *       200:
 *         description: Domain verified successfully
 */
router.post('/:workspaceId/domains/:domainId/verify', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(verifyDomain));

// SDK Keys
/**
 * @openapi
 * /workspaces/{workspaceId}/sdk-keys:
 *   get:
 *     summary: Get workspace SDK keys
 *     description: Retrieves the public key and partially masked secret key for the workspace. Only owners and admins allowed.
 *     tags:
 *       - SDK Keys
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Keys retrieved successfully
 */
router.get('/:workspaceId/sdk-keys', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(getSdkKeys));

/**
 * @openapi
 * /workspaces/{workspaceId}/sdk-keys/rotate:
 *   post:
 *     summary: Rotate SDK keys
 *     description: Generates a new public and secret key pair for the workspace. Returns the new secret key in full once. Only owners and admins allowed.
 *     tags:
 *       - SDK Keys
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Keys rotated successfully
 */
router.post('/:workspaceId/sdk-keys/rotate', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(rotateSdkKeys));

// Modules
/**
 * @openapi
 * /workspaces/{workspaceId}/modules:
 *   get:
 *     summary: Get workspace modules status
 *     description: Lists the enabled/disabled statuses of all platform modules for this workspace. Only owners and admins allowed.
 *     tags:
 *       - Workspace Modules
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Modules listed successfully
 */
router.get('/:workspaceId/modules', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(listModules));

/**
 * @openapi
 * /workspaces/{workspaceId}/modules/{moduleKey}:
 *   patch:
 *     summary: Toggle workspace module
 *     description: "Enables or disables a specific platform module (whitelist: blogs, chat). Preserves existing JSONB configuration data. Only owners and admins allowed."
 *     tags:
 *       - Workspace Modules
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *       - in: path
 *         name: moduleKey
 *         required: true
 *         schema:
 *           type: string
 *         description: The module key (blogs or chat)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - enabled
 *             properties:
 *               enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Module toggled successfully
 */
router.patch('/:workspaceId/modules/:moduleKey', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(updateModule));

// Quotas
/**
 * @openapi
 * /workspaces/{workspaceId}/quotas:
 *   get:
 *     summary: Get workspace quotas and consumption
 *     description: Returns maximum resource limits and current usage/consumption statistics. Any member allowed.
 *     tags:
 *       - Workspace Quotas
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     responses:
 *       200:
 *         description: Quota details retrieved successfully
 */
router.get('/:workspaceId/quotas', requireWorkspace, asyncHandler(getQuotas));

// Invitations (Workspace side)
/**
 * @openapi
 * /workspaces/{workspaceId}/invitations/{invitationId}:
 *   delete:
 *     summary: Revoke workspace invitation
 *     description: Deletes/revokes a pending team invitation by ID. Only owners and admins allowed.
 *     tags:
 *       - Workspace Invitations
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The invitation ID
 *     responses:
 *       200:
 *         description: Invitation revoked successfully
 */
router.delete('/:workspaceId/invitations/:invitationId', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(revokeInvitation));

/**
 * @openapi
 * /workspaces/{workspaceId}/invitations/{invitationId}/resend:
 *   post:
 *     summary: Resend workspace invitation
 *     description: Re-sends the invitation email to the invitee, generating a new token and extending its expiration window. Only owners and admins allowed.
 *     tags:
 *       - Workspace Invitations
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The invitation ID
 *     responses:
 *       200:
 *         description: Invitation email resent successfully
 */
router.post('/:workspaceId/invitations/:invitationId/resend', requireWorkspace, requireRole(['owner', 'admin']), asyncHandler(resendInvitation));

// Ownership Transfer
/**
 * @openapi
 * /workspaces/{workspaceId}/transfer-ownership:
 *   post:
 *     summary: Transfer workspace ownership
 *     description: Transacts a safe workspace ownership transfer to another active member. Promotes target to owner, demotes current owner to admin, and updates target ownerId on the workspace. Only the Owner allowed.
 *     tags:
 *       - Workspaces
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The workspace ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: usr_target123
 *     responses:
 *       200:
 *         description: Ownership transferred successfully
 */
router.post('/:workspaceId/transfer-ownership', requireWorkspace, requireRole(['owner']), asyncHandler(transferOwnership));

export default router;
