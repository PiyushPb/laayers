# Laayers APIs Reference & Architecture

This document serves as the single source of truth for the API architecture across the `laayers` monorepo. It lists all available APIs, their base paths, and endpoints to give context to developers and AI assistants.

## 📁 Project Structure

The APIs are structured into different applications within the `/apps` directory of the monorepo:

- **Core API (`/apps/api`)**: Main application API handling authentication, users, workspaces, and domains.
- **Admin API (`/apps/admin-api`)**: Internal administrative API for managing platform metrics, overarching user statuses, and workspace limits/quotas.

---

## 1. Core API (`/apps/api`)

The Core API powers the main application functionalities.

* **Base Path**: `/api/v1`
* **Local URL**: `http://localhost:8000/api/v1`
* **Documentation**: `http://localhost:8000/docs` (Interactive Swagger/OpenAPI docs in Dev)

### 🛠️ System / Health
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/health` | No | Server uptime and DB connection status. |

### 🔑 Authentication (`/auth`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/auth/register` | No | Register new user, default workspace, send verification. |
| `POST` | `/auth/login` | No | Authenticate user & issue HTTP-only cookies. |
| `POST` | `/auth/refresh` | No | Refresh access tokens. |
| `POST` | `/auth/logout` | No | Clear cookies and revoke session. |
| `GET`  | `/auth/session` | **Yes** | Get authenticated user, workspace context, permissions. |
| `POST` | `/auth/forgot-password`| No | Request password reset email. |
| `POST` | `/auth/reset-password` | No | Reset password using token. |
| `POST` | `/auth/verify-email` | No | Verify email address. |
| `POST` | `/auth/resend-verification`| No | Resend verification email. |
| `GET`  | `/auth/sessions` | **Yes** | List active sessions. |
| `DELETE`|`/auth/sessions/:sessionId`| **Yes** | Revoke specific session. |
| `POST` | `/auth/logout-all` | **Yes** | Revoke all other sessions. |
| `POST` | `/auth/check-email` | No | Check if email is already registered. |

### 👤 User Profile (`/users`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/users/me` | **Yes** | Get active user profile. |
| `PATCH` | `/users/me` | **Yes** | Update active user profile. |
| `DELETE` | `/users/me` | **Yes** | Deactivate/delete account. |
| `GET` | `/users/me/workspaces` | **Yes** | Get workspaces summary for the user. |
| `POST` | `/users/me/avatar` | **Yes** | Upload profile avatar. |

### 🏢 Workspaces (`/workspaces`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/workspaces` | **Yes** | List workspaces user belongs to. |
| `POST` | `/workspaces` | **Yes** | Create new workspace. |
| `GET` | `/workspaces/:workspaceId` | **Yes** | Get workspace details. |
| `PATCH` | `/workspaces/:workspaceId` | **Yes** | Update workspace settings. |
| `DELETE` | `/workspaces/:workspaceId` | **Yes** | Delete workspace. |
| `POST` | `/workspaces/:workspaceId/switch`| **Yes** | Switch active workspace context. |
| `POST` | `/workspaces/:workspaceId/transfer-ownership`| **Yes** | Transfer ownership to another member. |

### ⚙️ Workspace Settings & Modules
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/workspaces/:workspaceId/settings`| **Yes** | Get workspace settings & branding. |
| `PATCH`| `/workspaces/:workspaceId/settings`| **Yes** | Update settings/branding. |
| `GET` | `/workspaces/:workspaceId/modules` | **Yes** | List available modules. |
| `PATCH`| `/workspaces/:workspaceId/modules/:moduleKey`| **Yes**| Enable/disable module. |

### 🌐 Workspace Domains
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/workspaces/:workspaceId/domains` | **Yes** | List workspace domains. |
| `POST` | `/workspaces/:workspaceId/domains` | **Yes** | Register new domain. |
| `PATCH`| `/workspaces/:workspaceId/domains/:domainId`| **Yes** | Update domain settings (e.g., set primary). |
| `DELETE`| `/workspaces/:workspaceId/domains/:domainId`| **Yes** | Remove domain. |
| `POST` | `/workspaces/:workspaceId/domains/:domainId/verify`| **Yes**| Trigger domain verification. |

### 🔑 SDK Keys & Quotas
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/workspaces/:workspaceId/sdk-keys`| **Yes** | Retrieve API keys. |
| `POST` | `/workspaces/:workspaceId/sdk-keys/rotate`| **Yes** | Rotate API keys. |
| `GET` | `/workspaces/:workspaceId/quotas` | **Yes** | Get quota consumption. |

### 👥 Workspace Members & Invitations
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/workspaces/:workspaceId/members` | **Yes** | List workspace members. |
| `POST` | `/workspaces/:workspaceId/members/invite`| **Yes** | Invite member. |
| `PATCH` | `/workspaces/:workspaceId/members/:memberId`| **Yes** | Update member role. |
| `DELETE`| `/workspaces/:workspaceId/members/:memberId`| **Yes** | Remove member. |
| `DELETE`| `/workspaces/:workspaceId/invitations/:invitationId`| **Yes** | Revoke invitation. |
| `POST` | `/workspaces/:workspaceId/invitations/:invitationId/resend`| **Yes**| Resend invitation. |

### ✉️ Public Invitations
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/invitations/:token` | No | Retrieve invitation details. |
| `POST` | `/invitations/accept` | **Yes** | Accept invitation. |
| `POST` | `/invitations/reject` | **Yes** | Reject invitation. |

---

## 2. Admin API (`/apps/admin-api`)

The Admin API is an internal application for super-admins to govern the system, manage global users, control quotas, and view metrics.

* **Base Path**: `/admin`
* **Local URL**: `http://localhost:<admin-port>/admin`

### 🛠️ System / Health
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/admin/health` | No | Check server uptime and database connection status. |

### 👥 Admin: Users Management (`/admin/users`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/admin/users` | **Yes** | List all users across the platform. |
| `GET` | `/admin/users/:id` | **Yes** | Get detailed profile of a specific user. |
| `PATCH` | `/admin/users/:id/status`| **Yes** | Suspend, ban, or update status of a user. |

### 🏢 Admin: Workspaces Management (`/admin/workspaces`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/admin/workspaces` | **Yes** | List all workspaces on the platform. |
| `GET` | `/admin/workspaces/:id` | **Yes** | Get extensive details for a specific workspace. |
| `PATCH` | `/admin/workspaces/:id/quotas`| **Yes** | Override default quotas/limits for a workspace. |
| `PATCH` | `/admin/workspaces/:id/modules`| **Yes** | Enable/disable premium modules for a workspace. |
| `DELETE`| `/admin/workspaces/:id` | **Yes** | Force delete a workspace (admin overrule). |

### 📈 Admin: Metrics (`/admin/metrics`)
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/admin/metrics/overview` | **Yes** | Get platform-wide overview metrics (MAUs, revenue, active workspaces, etc.). |

---

## 🧠 Memory Note for GPTs
When working within this repository:
1. Always verify which API application you are modifying (`/apps/api` vs `/apps/admin-api`).
2. Core API logic mostly lives in `apps/api/src/modules`.
3. Admin API logic lives in `apps/admin-api/src/modules`.
4. Ensure you use the proper shared packages (e.g., `@layers/database`, `@layers/types`) when adding new routes.
