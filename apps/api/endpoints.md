# Layers API Endpoints Reference

All routes are prefixed by `/api/v1` unless specified otherwise.
* **Base URL (Local)**: `http://localhost:8000/api/v1`
* **Interactive docs (Dev-only)**: `http://localhost:8000/docs`

---

## 🛠️ System / Health
Endpoints for monitoring status.

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/health` | No | Check server uptime and database connection status. |

---

## 🔑 Authentication (`/auth`)
Routes for managing registration, authentication, sessions, and recovery.

| Method | Endpoint | Auth Required | Body Params / Cookies | Description |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/auth/register` | No | `email`, `password`, `name` | Register a new user, default workspace, and send verification email. |
| `POST` | `/auth/login` | No | `email`, `password` | Authenticate user and issue secure HTTP-only cookies (with embedded session ID). |
| `POST` | `/auth/refresh` | No | Cookie: `refreshToken` | Refresh active access tokens using refresh session. |
| `POST` | `/auth/logout` | No | Cookie: `refreshToken` | Clear cookies and revoke session in database. |
| `GET`  | `/auth/session` | **Yes** | Cookie: `accessToken` | Get currently authenticated user, active workspace context, role, enabled modules, and permissions. |
| `POST` | `/auth/forgot-password` | No | `email` | Request password reset token via email. |
| `POST` | `/auth/reset-password` | No | `token`, `password` | Reset password using email verification token. |
| `POST` | `/auth/verify-email` | No | `token` | Verify email address using verification token. |
| `POST` | `/auth/resend-verification` | No | `email` | Resend verification email to user. |
| `GET`  | `/auth/sessions` | **Yes** | Cookie: `accessToken` | Retrieve a list of all active sessions for the user. |
| `DELETE`| `/auth/sessions/:sessionId` | **Yes** | Path: `sessionId` | Revoke a specific active session. |
| `POST` | `/auth/logout-all` | **Yes** | Cookie: `accessToken` | Revoke all other active sessions for the user (except current). |
| `POST` | `/auth/check-email` | No | `email` | Public check if email address is already registered. |

---

## 👤 User Profile (`/users`)
Endpoints for handling user identity details.

| Method | Endpoint | Auth Required | Body Params | Description |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/users/me` | **Yes** | None | Get active user profile details. |
| `PATCH` | `/users/me` | **Yes** | `name` | Update active user profile details. |
| `DELETE` | `/users/me` | **Yes** | None | Deactivate/delete user account. |
| `GET` | `/users/me/workspaces` | **Yes** | None | Get a summary of workspaces user belongs to, including roles and active indicator. |
| `POST` | `/users/me/avatar` | **Yes** | `avatarUrl` (optional) | Upload/scaffold profile avatar. |

---

## 🏢 Workspaces (`/workspaces`)
Routes for managing organization workspaces.

| Method | Endpoint | Auth Required | Roles Permitted | Body Params | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/workspaces` | **Yes** | Any Member | None | List all workspaces user belongs to. |
| `POST` | `/workspaces` | **Yes** | Any User | `name` | Create a new workspace and assign user as Owner. |
| `GET` | `/workspaces/:workspaceId` | **Yes** | Any Member | None | Get details of a specific workspace. |
| `PATCH` | `/workspaces/:workspaceId` | **Yes** | Owner, Admin | `name` | Update workspace name/settings. |
| `DELETE` | `/workspaces/:workspaceId` | **Yes** | Owner | None | Delete a workspace. |
| `POST` | `/workspaces/:workspaceId/switch` | **Yes** | Any Member | None | Switch the user's active workspace session context. |
| `POST` | `/workspaces/:workspaceId/transfer-ownership` | **Yes** | Owner | `userId` | Transfer workspace ownership to another member. |

---

## ⚙️ Workspace Settings & Modules (`/workspaces/:workspaceId/settings` & `/modules`)
Routes for managing branding, timezone preferences, and active feature modules.

| Method | Endpoint | Auth Required | Roles Permitted | Body Params | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/workspaces/:workspaceId/settings` | **Yes** | Owner, Admin | None | Get workspace settings (branding config and preferences). |
| `PATCH`| `/workspaces/:workspaceId/settings` | **Yes** | Owner, Admin | `branding`, `preferences` | Update settings (logo, color configurations, timezone, language). |
| `GET` | `/workspaces/:workspaceId/modules` | **Yes** | Owner, Admin | None | List available modules and their enabled state. |
| `PATCH`| `/workspaces/:workspaceId/modules/:moduleKey` | **Yes** | Owner, Admin | `enabled` | Enable/disable a specific module (whitelist: `blogs`, `chat`). |

---

## 🌐 Workspace Domains (`/workspaces/:workspaceId/domains`)
Routes for managing custom workspace domains.

| Method | Endpoint | Auth Required | Roles Permitted | Body Params | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/workspaces/:workspaceId/domains` | **Yes** | Any Member | None | List domains registered to the workspace. |
| `POST` | `/workspaces/:workspaceId/domains` | **Yes** | Owner, Admin | `domain`, `primary` | Register a new normalized domain (must be globally unique). |
| `PATCH`| `/workspaces/:workspaceId/domains/:domainId` | **Yes** | Owner, Admin | `primary` | Update domain settings (swaps primary domain within workspace). |
| `DELETE`| `/workspaces/:workspaceId/domains/:domainId` | **Yes** | Owner, Admin | None | Remove a domain. |
| `POST` | `/workspaces/:workspaceId/domains/:domainId/verify`| **Yes** | Owner, Admin | None | Trigger a simulated verification check for a domain. |

---

## 🔑 SDK Keys & Quotas (`/workspaces/:workspaceId/sdk-keys` & `/quotas`)
Routes for API keys and consumption monitoring.

| Method | Endpoint | Auth Required | Roles Permitted | Body Params | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/workspaces/:workspaceId/sdk-keys` | **Yes** | Owner, Admin | None | Retrieve workspace public key and masked secret key. |
| `POST` | `/workspaces/:workspaceId/sdk-keys/rotate` | **Yes** | Owner, Admin | None | Rotate/regenerate public and secret API keys (returns new keys in full). |
| `GET` | `/workspaces/:workspaceId/quotas` | **Yes** | Any Member | None | Get current workspace quota consumption counts and limits. |

---

## 👥 Workspace Members & Invitations (`/workspaces/:workspaceId/members` & `/invitations`)
Routes for team composition, access roles, and invite management.

| Method | Endpoint | Auth Required | Roles Permitted | Body/Path Params | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/workspaces/:workspaceId/members` | **Yes** | Any Member | None | List members of the workspace. |
| `POST` | `/workspaces/:workspaceId/members/invite` | **Yes** | Owner, Admin | `email`, `role` | Invite a user to the workspace via email. |
| `PATCH` | `/workspaces/:workspaceId/members/:memberId` | **Yes** | Owner, Admin | `role` (Safety protected) | Update workspace member role. Enforces safety locks on last owner. |
| `DELETE` | `/workspaces/:workspaceId/members/:memberId` | **Yes** | Owner, Admin | None (Safety protected) | Remove a member from the workspace. Enforces safety locks on last owner and self-removal. |
| `DELETE` | `/workspaces/:workspaceId/invitations/:invitationId`| **Yes** | Owner, Admin | Path: `invitationId` | Revoke a pending workspace invitation. |
| `POST` | `/workspaces/:workspaceId/invitations/:invitationId/resend`| **Yes** | Owner, Admin | Path: `invitationId` | Resend invitation email (extends expiration date and generates new token). |

---

## ✉️ Invitations Validation/Response (`/invitations`)
Public validation and acceptance of team invites.

| Method | Endpoint | Auth Required | Body/Path Params | Description |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/invitations/:token` | No | Path: `token` | Retrieve invitation workspace details before accepting. |
| `POST` | `/invitations/accept` | **Yes** | Body: `token` | Accept the invitation and join the workspace. |
| `POST` | `/invitations/reject` | **Yes** | Body: `token` | Reject the invitation. |

---

## 🚀 Placeholder Modules
Endpoints for future architecture scaling.

* **Public Module (`/public`)**: `GET /public/placeholder` (Public endpoint scaffold).
* **SDK Module (`/sdk`)**: `GET /sdk/placeholder` (SDK integration endpoint scaffold).

