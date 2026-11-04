# ZUNO ERP — Versioned REST API Specification

**Base URL**: `/api/v1`  
**Interactive Swagger UI**: `http://localhost:4000/api/docs`

---

## 1. Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new tenant, primary owner, company and trial | Public |
| `POST` | `/api/v1/auth/login` | Authenticate with credentials and issue JWT pair | Public |
| `POST` | `/api/v1/auth/refresh` | Rotate refresh token and issue new access token | Public |
| `GET` | `/api/v1/auth/me` | Fetch active profile, scopes and company access | Bearer JWT |

---

## 2. Organization & Companies (`/companies`, `/tenants`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/tenants/current` | Get current tenant profile and company list | Bearer JWT |
| `PATCH` | `/api/v1/tenants/current` | Update tenant details | Bearer JWT |
| `GET` | `/api/v1/companies` | List all legal company entities | Bearer JWT |
| `POST` | `/api/v1/companies` | Create new company under tenant | Bearer JWT |
| `GET` | `/api/v1/companies/:id` | Get company details with branches | Bearer JWT |
| `GET` | `/api/v1/companies/branches/list` | List operating branches and warehouses | Bearer JWT |
| `POST` | `/api/v1/companies/branches` | Create new branch | Bearer JWT |

---

## 3. Subscriptions & Modules (`/subscriptions`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/subscriptions/catalogue` | Get 19 SaaS module catalogue with pricing | Public |
| `GET` | `/api/v1/subscriptions/current` | Get active tenant subscription and entitlements | Bearer JWT |
| `GET` | `/api/v1/subscriptions/check-access/:code`| Verify module access entitlement | Bearer JWT |
| `POST` | `/api/v1/subscriptions/checkout` | Purchase modules & create invoice | Bearer JWT |
| `POST` | `/api/v1/subscriptions/webhook` | Idempotent payment gateway webhook | Signature Header |

---

## 4. Universal 243-Table Business Modules API (`/modules`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/modules/data/:tableName` | Paginated query on any approved catalogue table | Bearer JWT |
| `GET` | `/api/v1/modules/data/:tableName/:id` | Retrieve single record by ID | Bearer JWT |
| `POST` | `/api/v1/modules/data/:tableName` | Insert new operational business record | Bearer JWT |
| `PATCH` | `/api/v1/modules/data/:tableName/:id` | Update operational record | Bearer JWT |
| `DELETE` | `/api/v1/modules/data/:tableName/:id` | Soft-delete operational record | Bearer JWT |

---

## 5. Two-Database Historical Archive API (`/history`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/history/records` | Read-only search across Supabase cold archive | Bearer JWT |
| `POST` | `/api/v1/history/archive` | Stage record in operational Outbox | Bearer JWT |
| `POST` | `/api/v1/history/sync-worker/trigger` | Run outbox processing worker | Bearer JWT |

---

## 6. Executive Analytics & Health (`/dashboard`, `/health`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/dashboard/metrics` | Real-time KPIs, attendance %, sales & stock values | Bearer JWT |
| `GET` | `/api/v1/health` | Neon and Supabase health checks, latency & memory | Public |

