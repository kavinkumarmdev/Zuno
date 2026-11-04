# ZUNO ERP — Complete Enterprise SaaS Application

<p align="center">
  <img src="Logo.png" alt="Zuno ERP" width="120" />
</p>

<p align="center">
  <strong>Production-Oriented, Modular, Multi-Tenant SaaS Business Management Platform</strong>
</p>

---

## 🌟 Executive Overview
**ZUNO ERP** is a modern, modular, enterprise SaaS Enterprise Resource Planning platform built on strict multi-tenant boundaries, high-throughput financial precision (`NUMERIC`), and a resilient **two-database architecture**:
1. **Neon PostgreSQL (Operational Store)**: The live transactional source of truth for companies, users, subscriptions, 243 approved database catalogue tables, live inventory, payroll, and vouchers.
2. **Supabase PostgreSQL (Historical Archive)**: Cold storage compliance vault with immutable audit logs, archived fiscal periods, and deleted record tombstones.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Monorepo** | NPM Workspaces |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Radix UI primitives, Lucide Icons |
| **Data & State** | TanStack Query v5, React Hook Form, Zod, Recharts |
| **Backend API** | NestJS 11, TypeScript, REST API, Swagger / OpenAPI |
| **ORM** | Prisma ORM |
| **Operational DB** | Neon PostgreSQL (Shared database, isolated tenant keys) |
| **Historical DB** | Supabase PostgreSQL (Cold storage, SHA-256 seal) |
| **Security** | JWT (Access + Refresh Token Rotation), Argon2 / Bcrypt, RBAC + PBAC |
| **Reliable Sync** | Transactional Outbox Pattern with exponential backoff retry |

---

## 📂 Monorepo Structure

```text
zuno-erp/
├── apps/
│   ├── web/                    # React 19 + TypeScript + Vite + Tailwind CSS
│   │   ├── public/logo/        # Zuno Brand Logo (Logo.png)
│   │   └── src/
│   │       ├── components/     # Enterprise DataGrid, Layout, Sidebar, Header
│   │       ├── pages/          # Dashboard, 19 Business Modules, Subscriptions, Reports
│   │       ├── stores/         # AuthContext & Session Store
│   │       └── services/       # Axios API client with token refresh
│   └── api/                    # NestJS 11 Backend API Service
│       └── src/
│           ├── auth/           # JWT, Refresh Rotation, Login History
│           ├── tenants/        # Multi-Tenant Scoping & Resolvers
│           ├── companies/      # Companies, Branches, Fiscal Years
│           ├── subscriptions/  # Module Entitlements, Invoices, Webhooks
│           ├── permissions/    # Role Catalog & Fine-Grained Permissions
│           ├── modules/        # Universal Controller for 243 Approved Catalogue Tables
│           ├── history/        # Supabase Historical Search & Sync Worker
│           ├── audit/          # Security & Operational Audit Log
│           ├── dashboard/      # Real Aggregated KPI Metrics
│           └── database/       # Dual Prisma Clients (Neon & Supabase) + Outbox
├── packages/
│   ├── shared-types/           # Shared interfaces, DTOs & Enums
│   ├── shared-validation/      # Zod validation schemas
│   ├── ui/                     # Design tokens & status styles
│   └── config/                 # Base TypeScript configs
├── database/
│   ├── main/                   # Neon Operational Schema (243 Tables) & Seeds
│   │   ├── migrations/         # 001_initial_neon_243_tables.sql
│   │   ├── schema.prisma       # Prisma Operational Schema
│   │   └── seeds/              # Master Seed Data
│   ├── history/                # Supabase Historical Schema
│   │   ├── migrations/         # 001_initial_supabase_history.sql
│   │   └── schema.prisma       # Prisma Historical Schema
│   └── documentation/          # ERD Diagrams & Full Table Catalogue Markdown
├── infrastructure/
│   └── docker/                 # Dockerfiles & Nginx Config
├── docker-compose.yml          # Local full-stack orchestrator
└── .env.example                # Environment template
```

---

## 📊 Approved 243-Table Database Catalogue

The system implements the **complete 243 approved tables** from the official Zuno catalogue across 4 phases:

- **Phase 1: SaaS Foundation (48 Tables)**: Company Management (10), SaaS Platform & Subscription (24), Administration & Management (14).
- **Phase 2: Business Master Data (56 Tables)**: Product & Material Management (12), HR & Employee Management (16), Customer & Supplier Master (8), Land & Building Management (12), Assets & Maintenance Master (8).
- **Phase 3: Daily Business Operations (69 Tables)**: Purchase & Supplier Operations (12), Inventory & Warehouse (14), Sales & Customer Operations (12), Attendance & Leave Management (15), Production & Manufacturing (16).
- **Phase 4: Finance & Compliance (70 Tables)**: Banking & Accounting (18), Payroll & Benefits (16), Licence & Compliance (12), Government Integration & Statutory (14), Investment & Finance (10).

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- Node.js >= 20.x
- NPM >= 10.x
- Docker & Docker Compose (Optional for local DBs)

### 2. Installation
```bash
# Clone and install dependencies
npm install

# Compile shared monorepo packages
npm run build --workspace=@zuno/shared-types
npm run build --workspace=@zuno/shared-validation
npm run build --workspace=@zuno/ui
```

### 3. Environment Configuration
```bash
cp .env.example .env
```

### 4. Database Schema Generation & Seeding
```bash
# Generate Prisma clients
npm run db:generate

# Apply SQL migrations to Neon database
npm run db:migrate

# Seed master modules, demo tenant, companies, users
npm run db:seed
```

### 5. Running the Application
```bash
# Run both Backend API and Web Frontend concurrently:
npm run dev

# Or run independently:
npm run dev:api   # Starts NestJS API at http://localhost:4000
npm run dev:web   # Starts Vite React at http://localhost:5173
```

- **Web Frontend**: [http://localhost:5173](http://localhost:5173)
- **API Swagger Documentation**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)
- **Health Verification**: [http://localhost:4000/api/v1/health](http://localhost:4000/api/v1/health)

### 6. Default Demo Credentials
- **Username / Email**: `admin@acme.com`
- **Password**: `ZunoEnterprise2026!#`
- **Organization**: `Acme Global Enterprises Ltd` (`ACME-CORP`)

