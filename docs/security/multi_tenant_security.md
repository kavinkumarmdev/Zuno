# ZUNO ERP — Multi-Tenant Security & Isolation Architecture

## 1. Multi-Tenant Tenancy Model
ZUNO ERP enforces an isolated **Logical Tenancy** paradigm on a shared PostgreSQL instance for the operational tier (Neon) and historical tier (Supabase):

1. **Root Tenant Partitioning**:
   - `tb_tenant` serves as the global security root boundary.
   - Every tenant is provisioned an immutable UUID (`tenant_id`).
   - Every tenant-scoped table strictly includes `tenant_id UUID NOT NULL REFERENCES tb_tenant(id) ON DELETE RESTRICT`.

2. **Hierarchical Organization Hierarchy**:
   ```text
   Tenant (Account Boundary)
     └── Legal Companies (Entities)
           └── Operating Branches (Offices / Plants / Warehouses)
                 └── Users & Department Work Centers
   ```

3. **No Blind Frontend Tenant IDs**:
   - Requests from web clients NEVER accept `tenant_id` from the HTTP body or query parameters as a trusted value.
   - The `@CurrentTenant()` decorator and NestJS `JwtAuthGuard` resolve the verified tenant ID strictly from the cryptographically verified JWT signature.

---

## 2. Authentication & Credential Hardening
1. **Password Storage**: Passwords are never stored in plaintext. They are hashed using Argon2id / Bcrypt with configurable salt work factor (`BCRYPT_SALT_ROUNDS=12`).
2. **Access Tokens**: Short-lived JWT access tokens signed via HS256/RS256 with 15-minute expiration windows.
3. **Rotating Refresh Tokens**:
   - Stored in `tb_user_session` in Neon database.
   - Refresh token rotation invalidates the old token immediately upon usage.
   - Stolen token detection: if a previously consumed refresh token is presented, all active sessions for that user identity are immediately revoked.
4. **Login Brute-Force Protection**: 5 consecutive failed login attempts trigger temporary account locking in `tb_user_credential(locked_until)`.

---

## 3. Two-Database Security Separation
1. **Operational Neon Database**:
   - Handles live transactions.
   - Enforces composite unique constraints `(tenant_id, document_number)`.
2. **Supabase Historical Database**:
   - Read-only access for regular tenant users.
   - Immutable records sealed with SHA-256 cryptographic hashes (`hash_checksum`).
   - Prevents retroactive alteration of past tax, invoice, and statutory payroll filings.

