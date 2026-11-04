# ZUNO ERP — Local & Cloud Deployment Guide

## 1. Local Environment Setup

### 1.1 Requirements
- Node.js >= 20.x
- PostgreSQL 16 (or Docker)
- NPM >= 10.x

### 1.2 Running with Docker Compose
```bash
# Start Neon simulator (port 5432), Supabase simulator (port 5433), API (port 4000) and Web (port 5173)
docker compose up -d

# Verify all services are healthy
docker compose ps
```

### 1.3 Running in Local Development Mode
```bash
# Install all dependencies across monorepo
npm install

# Compile shared TypeScript packages
npm run build --workspace=@zuno/shared-types
npm run build --workspace=@zuno/shared-validation
npm run build --workspace=@zuno/ui

# Launch API & Web in concurrent watch mode
npm run dev
```

---

## 2. Cloud Production Deployment Architecture

```text
       DNS & Edge Layer (Cloudflare / Route 53)
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
Frontend Hosting (Vercel)   API Cluster (AWS ECS / Railway / Render)
(React 19 + Vite Static)    (NestJS Containers)
         │                       │
         │   HTTPS REST / v1     │
         └──────────────────────►┤
                                 ├───────────────────────┐
                                 ▼                       ▼
                      Operational Database      Historical Database
                       (Neon PostgreSQL)       (Supabase PostgreSQL)
```

### 2.1 Neon Operational Database Configuration
- Configure Neon autoscaling pooler for connection pooling.
- Use `NEON_DATABASE_URL` with `?sslmode=require`.
- Set `NEON_DIRECT_URL` for running schema migrations via Prisma.

### 2.2 Supabase Historical Database Configuration
- Configure dedicated compliance database project on Supabase.
- Store connection string in `SUPABASE_HISTORY_DATABASE_URL`.
- Enable point-in-time recovery and append-only trigger restrictions.

