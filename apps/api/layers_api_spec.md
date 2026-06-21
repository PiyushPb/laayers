# Layers API Specification - Production-Grade REST APIs

## 1. Architectural Conventions & Global Standards

### General Architecture
*   **Base URL:** `/api/v1`
*   **Format:** JSON for requests and responses.
*   **Authentication:** JWT via `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
*   **Multi-tenancy:** Hard isolation per workspace using `workspaceId` in path and context.
*   **Idempotency:** Enforced via `Idempotency-Key` header on mutating requests (POST/PATCH/DELETE).
*   **Pagination:** Cursor-based pagination (`cursor`, `limit`).
*   **Errors:** Standardized RFC 7807 Problem Details.

### Security Model
*   **Replay Attack Prevention:** Enforced via short-lived nonces and strict TLS requirements.
*   **Rate Limiting:** Token-bucket rate limiting via Redis (Workspace scoped + IP scoped).
*   **Secret Masking:** Keys hashed with `Argon2id` or `SHA-256` depending on lookup needs.
*   **Data Redaction:** PII and secrets redacted at the logger level before hitting stdout/storage.

### Permission Matrix
| Role | Domains | SDK Keys | Billing | Audit Logs |
| :--- | :--- | :--- | :--- | :--- |
| **Owner** | Full Access | Full Access | Full Access | Read |
| **Admin** | Read/Write | Read/Write | Read | Read |
| **Developer** | Read | Read/Write | No Access | No Access |
| **Viewer** | Read | Read | No Access | No Access |

---

## Module 1 — Workspace Domains

### Domain Verification Strategy
*   **Ownership:** Verified via TXT record (`layers-verification=<token>`).
*   **Routing:** Verified via CNAME (subdomains) pointing to `cname.layers.com` or A/ALIAS records for root domains pointing to Anycast IPs.
*   **Polling:** Background workers (BullMQ) poll DNS changes every 5 mins for 72 hours.
*   **SSL Status:** Managed via Let's Encrypt / Cloudflare for SaaS.

---

### Endpoint: List Domains
**Method:** `GET` | **Path:** `/workspaces/:workspaceId/domains`
**Description:** Retrieve all custom domains associated with a workspace.
**Authentication:** Role: `Viewer`, Permission: `domains:read`, Scope: `workspace`
**Request:**
*   Headers: `Cookie`
*   Query Params: `limit` (max 100), `cursor`, `status` (verified, pending, failed)
**Validation:** `limit` must be integer 1-100. Workspace ID must be valid UUID.
**Business Logic:** Queries the `domains` table filtered by `workspace_id`. Uses index on `(workspace_id, created_at)`.
**Response:** `200 OK`
```json
{
  "data": [
    { "id": "dom_123", "domain": "app.acme.com", "status": "verified", "is_primary": true }
  ],
  "meta": { "next_cursor": "encoded_string", "has_more": false }
}
```

### Endpoint: Add Domain
**Method:** `POST` | **Path:** `/workspaces/:workspaceId/domains`
**Description:** Register a new custom domain for the workspace.
**Authentication:** Role: `Admin`, Permission: `domains:write`, Scope: `workspace`
**Request:**
*   Headers: `Cookie`, `Idempotency-Key`
*   Body: `{ "domain": "app.acme.com" }`
**Validation:** `domain` valid hostname regex. Max length 253. Cannot be a reserved domain (`*.layers.com`). Duplicate check across ALL workspaces globally.
**Business Logic:**
1. Check global uniqueness of domain.
2. Generate secure `verification_token`.
3. Insert into `domains` table.
4. Enqueue `domain.dns_poll` background job.
**Audit Log:** `workspace.domain.created` (actor, domain).
**Database:** Insert into `domains`. Transaction required.
**Errors:** `400` (Invalid domain), `403` (Forbidden), `409` (Domain already registered), `422` (Quota exceeded).

### Endpoint: Get Domain
**Method:** `GET` | **Path:** `/workspaces/:workspaceId/domains/:domainId`
**Description:** Get detailed status and configuration for a specific domain.
**Authentication:** Role: `Viewer`, Permission: `domains:read`, Scope: `workspace`
**Request:** Path Params: `workspaceId`, `domainId`
**Response:** `200 OK` with detailed SSL, DNS status, and routing config.

### Endpoint: Update Domain
**Method:** `PATCH` | **Path:** `/workspaces/:workspaceId/domains/:domainId`
**Description:** Update domain configuration (e.g., custom redirect path).
**Authentication:** Role: `Admin`, Permission: `domains:write`, Scope: `workspace`
**Request:** Body: `{ "redirect_url": "https://acme.com/login" }`

### Endpoint: Delete Domain
**Method:** `DELETE` | **Path:** `/workspaces/:workspaceId/domains/:domainId`
**Description:** Remove domain from workspace.
**Authentication:** Role: `Admin`, Permission: `domains:write`, Scope: `workspace`
**Business Logic:** Soft delete. Remove from edge router/proxy. Revoke SSL cert tracking.
**Audit Log:** `workspace.domain.deleted`

### Endpoint: Verify Domain
**Method:** `POST` | **Path:** `/workspaces/:workspaceId/domains/:domainId/verify`
**Description:** Trigger a manual synchronous DNS verification check.
**Authentication:** Role: `Admin`, Permission: `domains:write`, Scope: `workspace`
**Business Logic:** Calls external DNS provider (e.g., Cloudflare/AWS Route53). If verified, updates status, generates SSL cert via background job.
**Response:** `200 OK` `{ "status": "verified" }`

### Endpoint: Set Primary Domain
**Method:** `POST` | **Path:** `/workspaces/:workspaceId/domains/:domainId/set-primary`
**Description:** Make this domain the primary domain for workspace links/emails.
**Validation:** Domain must have `status=verified`.
**Business Logic:** Transaction: set `is_primary=false` for all other workspace domains, set `is_primary=true` for target domain.
**Audit Log:** `workspace.domain.primary_updated`

### Endpoint: Recheck Domain SSL/CDN
**Method:** `POST` | **Path:** `/workspaces/:workspaceId/domains/:domainId/recheck`
**Description:** Re-verify SSL certificate provisioning and CDN propagation.

### Endpoint: Get DNS Records
**Method:** `GET` | **Path:** `/workspaces/:workspaceId/domains/:domainId/dns-records`
**Description:** Returns required DNS records (TXT, CNAME, A) the user must configure.

### Endpoint: Get Verification Status
**Method:** `GET` | **Path:** `/workspaces/:workspaceId/domains/:domainId/verification-status`
**Description:** Get live verification status (checks performed, errors encountered).

---

## Module 2 — SDK Keys

### SDK Key Architecture
*   **Storage:** Keys generated securely (e.g., `lyr_prod_...`). Stored in DB as a one-way `SHA-256` hash.
*   **Visibility:** Displayed only ONCE in the response of the `POST` creation endpoint.
*   **Rotation:** Seamless rotation supports having multiple active keys temporarily or atomic swaps.

### Endpoint: List SDK Keys
**Method:** `GET` | **Path:** `/workspaces/:workspaceId/sdk-keys`
**Description:** List all SDK keys (redacted).
**Authentication:** Role: `Developer`, Permission: `keys:read`, Scope: `workspace`
**Response:**
```json
{ "data": [{ "id": "key_123", "name": "Frontend Prod", "prefix": "lyr_prod_abcd", "environment": "production", "last_used_at": "2023-10-01T..." }] }
```

### Endpoint: Create SDK Key
**Method:** `POST` | **Path:** `/workspaces/:workspaceId/sdk-keys`
**Description:** Generate a new SDK key.
**Authentication:** Role: `Admin`, Permission: `keys:write`, Scope: `workspace`
**Request:** Body: `{ "name": "Backend Key", "environment": "production", "scopes": ["users:read"] }`
**Validation:** `environment` enum [development, preview, production].
**Business Logic:**
1. Generate cryptographically secure random string (32 bytes).
2. Format as `lyr_{env}_{random}`.
3. Hash key using SHA-256.
4. Insert hash, prefix (first 13 chars), and metadata into DB.
**Response:** `201 Created`. Payload includes the `raw_key` (ONLY TIME SHOWN).
**Audit Log:** `workspace.sdk_key.created`

### Endpoint: Get SDK Key Metadata
**Method:** `GET` | **Path:** `/workspaces/:workspaceId/sdk-keys/:keyId`
**Description:** Get key details, permissions, and usage stats.

### Endpoint: Update SDK Key
**Method:** `PATCH` | **Path:** `/workspaces/:workspaceId/sdk-keys/:keyId`
**Description:** Update key name or scopes.

### Endpoint: Delete SDK Key
**Method:** `DELETE` | **Path:** `/workspaces/:workspaceId/sdk-keys/:keyId`
**Description:** Permanently remove an SDK key. Hard delete or soft delete depending on audit requirements.

### Endpoint: Rotate SDK Key
**Method:** `POST` | **Path:** `/workspaces/:workspaceId/sdk-keys/:keyId/rotate`
**Description:** Generate a new secret for an existing key, optionally setting an expiration for the old secret.
**Request:** Body `{ "expire_old_in_hours": 24 }`
**Business Logic:** Generates new secret, updates hash. Old hash is kept in `sdk_keys_legacy_hashes` table with a TTL.
**Audit Log:** `workspace.sdk_key.rotated`

### Endpoint: Reveal SDK Key
**Method:** `POST` | **Path:** `/workspaces/:workspaceId/sdk-keys/:keyId/reveal`
**Description:** Fails. By design, keys cannot be revealed. Returns `400 Bad Request` explaining keys are hashing-only. (Included here explicitly to define the security boundary).

### Endpoint: Revoke SDK Key
**Method:** `POST` | **Path:** `/workspaces/:workspaceId/sdk-keys/:keyId/revoke`
**Description:** Immediately invalidates the key.
**Business Logic:** Sets `status = revoked`. Clears from Redis cache.
**Audit Log:** `workspace.sdk_key.revoked`

### Endpoint: Enable / Disable SDK Key
**Method:** `POST` | **Path:** `/workspaces/:workspaceId/sdk-keys/:keyId/(enable|disable)`
**Description:** Temporarily pause or resume key functionality without revoking.

---

## Module 3 — Billing & Subscription

### Billing Architecture
*   Abstracts Razorpay / Stripe via internal unified schema.
*   Webhook handlers strictly idempotent using `processed_webhooks` table.
*   Proration calculated internally or deferred to payment gateway.

### Endpoint: Get Subscription Status
**Method:** `GET` | **Path:** `/billing/subscription`
**Authentication:** Role: `Admin`, Permission: `billing:read`, Scope: `workspace`
**Response:** Plan tier, status (active, past_due, trialing), seats, renewal date, features enabled.

### Endpoint: Update Subscription Details
**Method:** `PATCH` | **Path:** `/billing/subscription`
**Description:** Update billing email or tax ID.

### Endpoint: Cancel Subscription
**Method:** `POST` | **Path:** `/billing/subscription/cancel`
**Request:** Body `{ "reason": "too expensive", "cancel_at_period_end": true }`
**Business Logic:** Calls payment provider. Updates DB `cancel_at_period_end=true`.
**Audit Log:** `billing.subscription.cancelled`

### Endpoint: Resume Subscription
**Method:** `POST` | **Path:** `/billing/subscription/resume`
**Description:** Reverts cancellation if period hasn't ended.

### Endpoint: Change Plan (Upgrade/Downgrade)
**Method:** `POST` | **Path:** `/billing/subscription/change-plan`
**Request:** Body `{ "plan_id": "pro_monthly", "seats": 5 }`
**Business Logic:**
1. Calculate proration.
2. If upgrade, charge difference immediately via saved payment method.
3. If downgrade, apply credits and schedule plan change for next cycle.
**Audit Log:** `billing.subscription.plan_changed`

### Endpoint: Get Usage
**Method:** `GET` | **Path:** `/billing/usage`
**Description:** Returns current period usage for metered billing (e.g., API calls made).

### Endpoint: List Invoices & Get Invoice
**Method:** `GET` | **Path:** `/billing/invoices`
**Method:** `GET` | **Path:** `/billing/invoices/:invoiceId`
**Response:** Array of invoice objects with `download_url` (PDF).

### Endpoint: Manage Payment Methods
**Method:** `GET` | **Path:** `/billing/payment-methods`
**Method:** `POST` | **Path:** `/billing/payment-methods`
**Method:** `DELETE` | **Path:** `/billing/payment-methods/:id`
**Description:** List, add, or remove credit cards. Primary card logic applied.

### Endpoint: Create Checkout Session
**Method:** `POST` | **Path:** `/billing/checkout`
**Description:** Generates a Stripe/Razorpay hosted checkout URL for upgrades.
**Response:** `{ "url": "https://checkout.stripe.com/..." }`

### Endpoint: Generate Customer Portal Session
**Method:** `POST` | **Path:** `/billing/customer-portal`
**Description:** Generates URL for self-serve billing management.

### Endpoint: Webhooks (Public)
**Method:** `POST` | **Path:** `/billing/webhooks`
**Description:** Receives events from payment gateway (e.g., `invoice.payment_succeeded`).
**Security:** Signature verification.
**Idempotency:** Checks `gateway_event_id` against `processed_webhooks` table.

### Endpoint: Billing History
**Method:** `GET` | **Path:** `/billing/history`
**Description:** Ledger of credits, charges, and refunds.

---

## Module 4 — Audit Logs

### Audit Architecture
*   **Immutability:** Written to PostgreSQL append-only table. Deleted only by background archival jobs based on retention policy.
*   **Redaction:** Pre-processing strips passwords, tokens, and PII.
*   **Structure:** Strongly typed JSONB payload for `metadata`.

### Endpoint: List Audit Logs
**Method:** `GET` | **Path:** `/workspaces/:workspaceId/audit-logs`
**Authentication:** Role: `Owner`, Permission: `audit:read`, Scope: `workspace`
**Request:**
*   Query Params: `start_date`, `end_date`, `actor_id`, `action`, `resource_type`, `limit`, `cursor`.
**Response:**
```json
{
  "data": [
    {
      "id": "log_123",
      "timestamp": "2023-10-01T12:00:00Z",
      "actor": { "id": "usr_123", "email": "admin@acme.com", "type": "user" },
      "action": "workspace.domain.verified",
      "resource": { "type": "domain", "id": "dom_123" },
      "context": { "ip_address": "192.168.1.1", "user_agent": "Mozilla...", "country": "US" }
    }
  ]
}
```

### Endpoint: Get Audit Log Details
**Method:** `GET` | **Path:** `/workspaces/:workspaceId/audit-logs/:id`
**Description:** Get full `old_value` and `new_value` diffs.

### Full Event Catalog
*   `workspace.created`, `workspace.updated`, `workspace.deleted`
*   `member.invited`, `member.removed`, `member.role_changed`
*   `domain.created`, `domain.verified`, `domain.deleted`, `domain.primary_updated`
*   `sdk_key.created`, `sdk_key.rotated`, `sdk_key.revoked`, `sdk_key.deleted`
*   `billing.subscription.created`, `billing.subscription.updated`, `billing.subscription.cancelled`, `billing.subscription.plan_changed`
*   `billing.payment_method.added`, `billing.invoice.paid`, `billing.invoice.failed`
*   `auth.login.success`, `auth.login.failed`, `auth.logout`, `auth.password.changed`, `auth.mfa.enabled`

---

## 5. PostgreSQL Schema & Drizzle ORM Guidelines

### Core Tables
```sql
-- Workspaces
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Domains
CREATE TABLE domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    domain VARCHAR(253) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    verification_token VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_domains_workspace ON domains(workspace_id);

-- SDK Keys
CREATE TABLE sdk_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    prefix VARCHAR(20) NOT NULL,
    hash VARCHAR(255) NOT NULL,
    environment VARCHAR(50) NOT NULL,
    scopes JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'active',
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_sdk_keys_hash ON sdk_keys(hash);
CREATE INDEX idx_sdk_keys_workspace ON sdk_keys(workspace_id);

-- Audit Logs (Append Only)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    actor_id UUID,
    actor_type VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(255),
    old_value JSONB,
    new_value JSONB,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Partitioning recommended for audit_logs by created_at (monthly)
CREATE INDEX idx_audit_logs_workspace_date ON audit_logs(workspace_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

### Implementation Notes for TypeScript + Express + Drizzle
1.  **Middleware:** Extract `workspaceId` from path parameters and enforce RBAC via standard Express middleware before reaching controllers.
2.  **Drizzle Setup:** Use Postgres.js driver. Wrap sensitive DB operations in `db.transaction`.
3.  **Error Handling:** Use an asynchronous wrapper (`express-async-handler`) to catch promise rejections and funnel them to a global error handler that formats to RFC 7807.
4.  **Validation:** Use `Zod` for request schema validation at the router level.
5.  **Caching:** Cache `sdk_keys` hashes in Redis (e.g., `SET sdk_key:hash_value workspace_id`) with a TTL. Invalidate on key revocation.

---

## 6. Error Catalogue
Standardized HTTP response format:
```json
{
  "type": "https://api.layers.com/errors/validation-error",
  "title": "Validation Error",
  "status": 422,
  "detail": "The domain name provided is invalid.",
  "errors": [{ "field": "domain", "message": "Must be a valid hostname" }]
}
```

*   `400 Bad Request`: Malformed JSON, business logic violation.
*   `401 Unauthorized`: Missing or invalid JWT.
*   `403 Forbidden`: Valid JWT, but lacking RBAC permissions.
*   `404 Not Found`: Resource doesn't exist or doesn't belong to the workspace.
*   `409 Conflict`: Resource state conflict (e.g., domain already verified by another tenant).
*   `422 Unprocessable Entity`: Zod schema validation failures.
*   `429 Too Many Requests`: Rate limit exceeded.
*   `500 Internal Server Error`: Unhandled exception. (Stack trace omitted in production).
